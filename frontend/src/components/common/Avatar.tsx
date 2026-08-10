interface AvatarProps {
  name: string;
  image?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Avatar({
  name,
  image,
  size = 'md',
}: AvatarProps) {
  const sizes = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  };

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-full bg-gray-200 font-medium ${sizes[size]}`}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}