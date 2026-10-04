#![no_std]
#![no_main]
#![feature(int_roundings)]

use core::num::NonZeroU64;
use core::panic::PanicInfo;
#[panic_handler]
fn panic(_info: &PanicInfo) -> ! {
    loop {}
}

pub type VarIntBufferCell = u64;
pub const BITS_PER_CELL: u64 = u64::BITS as u64;
pub struct VarIntBuffer {
    capacity: NonZeroU64,
    bit_size: NonZeroU64,
    bit_mask: NonZeroU64,
    bit_index_max: NonZeroU64,
    #[allow(unused)]
    cells: &'static [VarIntBufferCell; 4]
}

#[inline(never)]
#[unsafe(no_mangle)]
fn location_accessor_of(buffer: &VarIntBuffer, position: usize) -> (u64, u64, u64, u64, u64, u64) {
    let bit_size = buffer.bit_size.get().min(BITS_PER_CELL);
    let bit_mask = buffer.bit_mask.get();
    let bit_index_max = buffer.bit_index_max.get();

	let bit_index_low = (position as u64).saturating_mul(bit_size);
    let bit_index_high = bit_index_low + bit_size;
	let offset_of_cell_a = bit_index_low.div_floor(BITS_PER_CELL).min(bit_index_max);
	let offset_of_cell_b = bit_index_high.div_floor(BITS_PER_CELL).min(bit_index_max);

	let offset_in_cell_a = (bit_index_low % BITS_PER_CELL).min(BITS_PER_CELL);
	let mask_in_cell_a = (bit_mask << offset_in_cell_a);
    if offset_of_cell_a == offset_of_cell_b {return (
        offset_of_cell_a, offset_of_cell_a,
        offset_in_cell_a, 0,
        mask_in_cell_a, 0
    );}

	let offset_in_cell_b = (bit_index_high % BITS_PER_CELL).min(BITS_PER_CELL);
	let mask_in_cell_b = if (offset_in_cell_b + bit_size) <= BITS_PER_CELL {
		0
	} else {
		bit_mask.overflowing_shr(
            (BITS_PER_CELL - offset_in_cell_a) as u32
        ).0
	};
	return (
        offset_of_cell_a, offset_of_cell_b,
        offset_in_cell_a, offset_in_cell_b,
        mask_in_cell_a, mask_in_cell_b
    )
}

// If you use `main()`, declare it as `pub` to see it in the output:
pub fn main() {
    let cells = &[0,0,0,0];
    let bit_size: u64 = 3;
    let bit_mask: u64 = (1 << bit_size) - 1;
    let bit_index_max: u64 = bit_size.saturating_mul(cells.len() as u64);
    let buffer = VarIntBuffer {
        capacity: NonZeroU64::new((64 * cells.len() as u64) / bit_size).unwrap(),
        bit_size: NonZeroU64::new(bit_size).unwrap(),
        bit_mask: NonZeroU64::new(bit_mask).unwrap(),
        bit_index_max: NonZeroU64::new(bit_index_max).unwrap(),
        cells
    };
    let location = location_accessor_of(&buffer, 63);
    let _location = core::hint::black_box(location);
}
