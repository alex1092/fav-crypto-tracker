import { Card, CardContent, CardHeader } from "./ui/card";

type TotalsCardProps = {
  title: string;
  value: string;
};

export default function TotalsCard({ title, value }: TotalsCardProps) {
  if (!title || !value) return null;

  const formattedValue = Number(value).toFixed(0);

  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardContent className="text-2xl font-bold">
        {title !== "Market Cap Change" ? (
          formattedValue
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
