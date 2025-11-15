import { Card, CardContent } from "../ui/card";

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
}) => (
  <Card className="p-6 border border-border hover:shadow-lg transition-all">
    <CardContent className="flex flex-col items-center text-center gap-2">
      <div className="bg-muted/50 p-3 rounded-full">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      )}
    </CardContent>
  </Card>
);

export default StatCard;