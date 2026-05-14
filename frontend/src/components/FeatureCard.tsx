type FeatureCardProps = {
  title: string;
  description: string;
};

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="feature-card">
      <div className="feature-dot" />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
