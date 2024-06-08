import currency from "currency.js";
import { Card, CardContent, CardHeader } from "./ui/card";

type TotalsCardProps = {
  title: string;
  value: number | currency | string;
};

export default function TotalsCard({ title, value }: TotalsCardProps) {
  if (!title || !value) return null;

  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardContent className="text-2xl font-bold">
        {title !== "Market Cap Change" ? (
          <span>{value.toString()}</span>
        ) : (
          <span
            className={Number(value) > 0 ? "text-green-500" : "text-red-500"}
          >
            {`${Number(value).toFixed(2)}%`}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
