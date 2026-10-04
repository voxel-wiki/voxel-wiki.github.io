#nullable enable
using System;
using System.Linq;
using System.Runtime.CompilerServices;

// Note: These layouts could be pre-cached,
// as there's only 33 possible configurations.
// (any size>32 is ^^ forced to be size=64)
public readonly struct VarIntBufferLayout {
	public readonly byte  ElementsPerCell;
	public readonly byte  ElementSize;
	public readonly ulong ElementMask;
	
	public VarIntBufferLayout(byte element_size) {
		this.ElementSize = element_size;
		this.ElementMask = ElementMaskForSize(element_size);
		this.ElementsPerCell = ElementsPerCellForSize(element_size);
	}
	
	[MethodImpl(MethodImplOptions.AggressiveInlining)]
	public static ulong ElementMaskForSize(byte element_size) {
		// Element sizes above 32 cannot be packed:
		if(element_size > 32) return ulong.MaxValue;
		return ((ulong)1 << (int) element_size) - 1;
	}
	
	[MethodImpl(MethodImplOptions.AggressiveInlining)]
	public static byte ElementsPerCellForSize(byte element_size) {
		if(element_size == 0) return 0;
		// Element sizes above 32 cannot be packed:
		if(element_size > 32) return 1;
		return (byte) (64 / element_size);
	}
	
	[MethodImpl(MethodImplOptions.AggressiveInlining)]
	public uint ElementCellsForCapacity(uint capacity) {
		if (ElementSize == 0 || capacity == 0) return 0;
		// Element sizes above 32 cannot be packed:
		if (ElementSize > 32) return capacity;
		// Power-Of-Two element sizes don't need an extra/overflow cell:
		if ((ElementSize & (ElementSize - 1)) == 0) return (capacity * ElementSize) / 64;
		return (capacity + ElementsPerCell) / ElementsPerCell;
	}
	
	[MethodImpl(MethodImplOptions.AggressiveInlining)]
	public (ulong cell, byte shift, ulong mask) LocationFor(uint position) {
		ulong offset_of_cell = (ulong)position / (ulong)ElementsPerCell;
		ulong offset_in_cell = ((ulong)position % (ulong)ElementsPerCell) * ElementSize;
		ulong bit_mask = ElementMask << (int)offset_in_cell;
		return (offset_of_cell, (byte)offset_in_cell, bit_mask);
	}
	
	// todo: re-implement as plain struct
	[MethodImpl(MethodImplOptions.AggressiveInlining)]
	public System.Collections.Generic.IEnumerable<(uint position, uint cell, byte shift, ulong mask)> BufferIterator(uint capacity) {
		uint cells_count = this.ElementCellsForCapacity(capacity);
		uint position = 0;
		for(uint cell = 0; cell < cells_count; cell++) {
			ulong cell_mask = ElementMask;
			byte cell_shift = 0;
			for(int element = 0; element < ElementsPerCell && position < capacity; element++) {
				yield return (position++, cell, cell_shift, cell_mask);
				cell_mask = cell_mask << ElementSize;
				cell_shift = (byte)(cell_shift + ElementSize);
			}
		}
	}
	
	// todo: re-implement as plain struct
	[MethodImpl(MethodImplOptions.AggressiveInlining)]
	public System.Collections.Generic.IEnumerable<(uint position, byte shift, ulong mask)> CellIterator(uint with_position = 0) {
		uint position = with_position;
		ulong cell_mask = ElementMask;
		byte cell_shift = 0;
		for(int element = 0; element < ElementsPerCell; element++) {
			yield return (position++, cell_shift, cell_mask);
			cell_mask = cell_mask << ElementSize;
			cell_shift = (byte)(cell_shift + ElementSize);
		}
	}
}

public class VarIntBuffer {
	/** How many elements this buffer holds. */
	public readonly uint Capacity;
	
	/** Layout information for the buffer and its cells. **/
	public VarIntBufferLayout Layout;
	public byte ElementsPerCell => this.Layout.ElementsPerCell;
	public byte ElementSize => this.Layout.ElementSize;
	public ulong ElementMask => this.Layout.ElementMask;
	
	/**
	 * Cells holding the packed/compacted/compressed elements.
	 * Array size is either `capacity * bit_size_int / 64`, or `0`.
	**/
	private ulong[] Cells; // = Array.Empty<ulong>();
	public uint CellCount => (uint) this.Cells.Length;
	
	public VarIntBuffer(uint capacity, byte bit_size, ulong[]? cells = null) {
		this.Capacity = capacity;
		this.Layout = new(bit_size);
		
		var cells_length = this.Layout.ElementCellsForCapacity(this.Capacity);
		
		if(cells_length == 0) {
			// Doesn't matter if cells was passed: use the Empty.
			this.Cells = Array.Empty<ulong>();
		} else if(cells is not null) {
			// Ensure passed in cells array has the correct length.
			if(cells.Length != cells_length) throw new ArgumentException($"{this} Expected uint[{cells_length}] because cap={capacity} & bits={bit_size}, but got *cells[{cells.Length}]");
			this.Cells = cells;
		} else {
			this.Cells = new ulong[cells_length];
		}
		
		Console.WriteLine($"{this} Created uint[{cells_length}] because cap={capacity} & bits={bit_size}");
	}
	
	// Indexer for syntactic convenience.
	public ulong this[uint position] {
		get => this.Get(position);
		set => this.Set(position, value);
	}
	
	public override string ToString() {
		return $"VarIntBuffer[{this.Capacity}](#{this.GetHashCode():X};b={this.ElementSize};c={this.CellCount})";
	}
	
	public string ToStringOfCells() {
		return "{"+string.Join(",",this.Cells.Select(c=>c.ToString("B64")))+"}";
	}
	
	public (ulong cell, byte shift, ulong mask) LocationFor(uint position) {
		if(position >= this.Capacity) throw new ArgumentException($"Expected position within 0..{this.Capacity}, but got {position}");
		return this.Layout.LocationFor(position);
	}
	
	public ulong Get(uint position) {
		var (cell, shift, mask) = this.LocationFor(position);
		var cellval = this.Cells[cell];
		var prev = (cellval & mask) >>> shift;
		return prev;
	}
	
	public ulong Set(uint position, ulong element) {
		if(element > this.ElementMask) throw new ArgumentException($"Expected uint(mask=0b{this.ElementMask:B}), but got 0b{element:B}");
		var (cell, shift, mask) = this.LocationFor(position);
		
		Console.Write($"{this} Wrote uint(0b{element:B}) to cell {cell} at {shift} with mask 0b{mask:B}, because cap={Capacity} & bits={this.ElementSize}");
		
		var cell_val = this.Cells[cell];
		var prev = (cell_val & mask) >>> shift;
		var next = (element << shift) & mask;
		cell_val = (cell_val & ~mask) | next;
		this.Cells[cell] = cell_val;
		
		Console.WriteLine($", previously uint(0b{prev:B}): {this.ToStringOfCells()}");
		
		return prev;
	}
	
	// todo: re-implement as plain struct
	[MethodImpl(MethodImplOptions.AggressiveInlining)]
	public System.Collections.Generic.IEnumerable<(uint position, ulong element)> WalkElements() {
		uint position = 0;
		for(uint cell = 0; cell < this.Cells.Length; cell++) {
			ulong cell_val = this.Cells[cell];
			ulong cell_mask = this.ElementMask;
			byte cell_shift = 0;
			for(int element = 0; element < this.ElementsPerCell && position < this.Capacity; element++) {
				var val = (cell_val & cell_mask) >>> cell_shift;
				yield return (position++, val);
				cell_mask = cell_mask << this.ElementSize;
				cell_shift = (byte) (cell_shift + this.ElementSize);
			}
		}
	}
	
	public void Fill(ulong element) {
		if(element == 0) {
			Array.Fill(this.Cells, (ulong) 0);
			return;
		}
		
		if(element > this.Layout.ElementMask) throw new ArgumentException($"Expected uint(mask=0b{this.ElementMask:B}), but got 0b{element:B}");
		
		// Step 1: Prefill a single cell with the correct pattern.
		ulong cell_val = 0;
		int cell_shift = 0;
		for(var i = 0; i < this.ElementsPerCell; i++) {
			cell_val |= element << cell_shift;
			cell_shift += this.ElementSize;
		}
		
		// Step 2: MEMCOPY goes BRRRRRRRR
		Array.Fill(this.Cells, cell_val);
	}
	
	/*
		Doubles the bit-size of this VarIntBuffer,
		resizing its cell storage, preserving all elements.
	*/
	public void Expand() {
		var old_layout = this.Layout;
		var old_cells = this.Cells;
		var old_element_size = old_layout.ElementSize;
		
		// Create new layout and allocate cells from/for it...
		var new_element_size = (byte) (Math.Min(old_element_size, (byte)1) * 2);
		var new_layout = new VarIntBufferLayout(new_element_size);
		var new_cells = new ulong[new_layout.ElementCellsForCapacity(this.Capacity)];
		
		// Grab enumerators for both layouts...
		var old_iter = old_layout.BufferIterator(this.Capacity).GetEnumerator();
		var new_iter = new_layout.BufferIterator(this.Capacity).GetEnumerator();
		
		// Enumerate all positions, copying from the old layout+cells, to the new layout+cells.
		for(uint position = 0; position < this.Capacity && (old_iter.MoveNext() && new_iter.MoveNext()); position++) {
			var old_loc = old_iter.Current;
			var new_loc = new_iter.Current;
			var old_val = (old_cells[old_loc.cell] & old_loc.mask) >> old_loc.shift;
			var new_val = (old_val << new_loc.shift) & new_loc.mask;
			new_cells[new_loc.cell] |= new_val;
		}
	}
	
	// TODO: Shrink(SCAN=true)
	// TODO: Resize(CAPACITY)
}

public class Program
{
	public static void Main()
	{
		Console.WriteLine("Hello World");
		uint bufl = (uint) Math.Pow(4, 3);
		var buf0 = new VarIntBuffer(bufl, 0, null);
		var buf1 = new VarIntBuffer(bufl, 1, null); // 0 .. 1
		var buf2 = new VarIntBuffer(bufl, 2, null); // 2 .. 3
		var buf3 = new VarIntBuffer(bufl, 3, null); // 4 .. 7
		var buf4 = new VarIntBuffer(bufl, 4, null); // 8 .. 15
		var buf5 = new VarIntBuffer(bufl, 5, null); // 16 .. 31
		var buf6 = new VarIntBuffer(bufl, 6, null); // 32 .. 63
		var buf7 = new VarIntBuffer(bufl, 7, null); // 64 .. 127
		var buf8 = new VarIntBuffer(bufl, 8, null); // 128 .. 255
		var buf9 = new VarIntBuffer(bufl, 9, null); // 256 .. 511
		var buf10 = new VarIntBuffer(bufl, 10, null); // 512 .. 1023
		var buf11 = new VarIntBuffer(bufl, 11, null); // 1024 .. 2047
		var buf12 = new VarIntBuffer(bufl, 12, null); // 2048 .. 4095
		var buf13 = new VarIntBuffer(bufl, 13, null); // 4096 .. 8191
		var buf14 = new VarIntBuffer(bufl, 14, null); // 8192 .. 16347
		var buf15 = new VarIntBuffer(bufl, 15, null); // 16348 .. 32767
		var buf16 = new VarIntBuffer(bufl, 16, null); // 32768 .. 65535
		// ...
		var buf33 = new VarIntBuffer(bufl, 33, null); // .. 8589934591
		
		buf2.Set(0, 3);
		buf2.Set(1, 3);
		buf2.Set(2, 3);
		buf2.Set(3, 3);
		buf2.Set(4, 3);
		
		var buf = buf3;
		for(uint i = 0; i < bufl; i++) {
			Console.Write($"#{i:0#} ");
			var acc = buf.LocationFor(i);
			try {
				ulong e = 3; // 0b10111110;
				ulong p = buf.Set(i, e);
				ulong r = buf.Get(i);
				if(r != e) throw new Exception($"Expected {e}, but got {r}");
			} catch(Exception e) {
				throw new Exception($"(cell={acc.cell}, shift={acc.shift}, mask=0b{acc.mask:B})", e);
			}
		}
		
		Console.WriteLine(string.Join(", ", buf.WalkElements().Select(v => $"#{v.position} = 0b{v.element:B}")));
	}
}