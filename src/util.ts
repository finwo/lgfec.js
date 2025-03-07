type ObjectKey = string | symbol | number;

export function majority(votes: number[]): null | number {

  // Count the votes
  const counted: Record<ObjectKey, number> = {};
  for(const vote of Object.values(votes)) {
    counted[vote] |= 0;
    counted[vote] ++;
  }

  // See who won
  let voteMax   = -Infinity;
  let voteValue = null;
  for(const [vote,count] of Object.entries(counted)) {
    if (count <= voteMax) continue;
    voteMax   = count;
    voteValue = vote;
  }
  return parseInt(voteValue);
}
