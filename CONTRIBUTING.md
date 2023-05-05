# Contributing

There are ***four*** methods to contribute to the wiki...

> **Note:** Only the first two methods need proper grammar, editing and information coherency; i.e.: minimal quality.

## Via Fork and Pull-Request

This is the only method were you have a proper preview of content as you write it.

The initial setup is as follows:

1. Fork the project.
1. Clone the project: `git clone https://github.com/YOUR-USERNAME-HERE/voxel-wiki.github.io.git`
1. Open a console/terminal in the cloned projects directory.
2. Install [Just](https://just.systems/) and [Zola](https://www.getzola.org/), so that they're on your `PATH`, *or* put them right in the projects directory. Both are self-contained executable files and *should* Just-Work™; open an issue if you're having trouble!
   - [Just Installation](https://just.systems/man/en/chapter_3.html).
   - [Zola Installation](https://www.getzola.org/documentation/getting-started/installation/)
3. Run `just init` from the project directory.

Then, to actually create & edit content:

1. Run `just dev-open` from the project directory.
   - Your browser of choice should open up.
   - If not, see if the console has errors.
2. Make your changes to the content.
3. Check the life-preview in your browser.
4. Repeat from 2 as long as you need.
5. Push the changes to your fork.
6. Create a pull-request.
7. Wait for a maintainer to review your changes.

If you're a maintainer (eg: you are part of the `voxel-wiki` organisation), you *may* directly push changes, as long as they don't affect too many pages. In the latter case, it's a better idea to do it trough a pull-request or a separate branch.

## Via Web Editor

1. Go to the [repository on GitHub](https://github.com/voxel-wiki/voxel-wiki.github.io).
1. Press the `.` key; the web editor will open.
1. Make your changes to the content.
1. Create a pull-request.
1. Wait for a maintainer to review your changes.

## Via GitHub Issue

1. Write a short paragraph about *any* topic related to voxels.
1. Create a new issue with the paragraph in it.
1. Wait for a maintainer to integrate your contribution.

## Via Discord

1. Write a short paragraph about *any* topic related to voxels.
1. Visit the official Discord server: http://voxelgamedev.com/
1. Go to the `#voxel-dot-wiki` channel.
1. Send the paragraph as a quote (`> ...`).
1. Wait for a maintainer to integrate your contribution.

