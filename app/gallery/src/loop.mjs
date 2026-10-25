// Original layout: each 3-unit artwork is followed by a 4-unit gap plus 1 unit.
export const EXHIBIT_SPACING = 8;

export function getLoopLength(artworkCount) {
  // Include the opening quotation as one slot, with the same gap at the seam.
  return (artworkCount + 1) * EXHIBIT_SPACING;
}

export function getLoopPosition(anchor, offset, length) {
  const position = anchor - offset * length;
  // Move an exhibit to its equivalent copy only while it is far offscreen.
  // An offset reset from 1 to 0 therefore leaves the visible scene unchanged.
  return ((position + length / 2) % length + length) % length - length / 2;
}
