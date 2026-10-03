import { StatCard } from "./stat-card";

const revenue = [31.2, 32.8, 32.1, 34.6, 36.2, 35.4, 38.1, 40.6, 39.8, 42.3, 45.1, 48.3];
const signups = [2680, 2810, 2745, 2902, 2860, 2795, 2650, 2712, 2580, 2490, 2425, 2315];

export default function StatCardDemo() {
  return (
    <div className="flex gap-4">
      <StatCard label="Monthly recurring revenue" value="$48,290" delta={12.4} data={revenue} />
      <StatCard label="New signups" value="2,315" delta={-4.6} data={signups} />
    </div>
  );
}
