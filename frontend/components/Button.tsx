import Image from "next/image";

type ButtonProps = {
  type: "button" | "submit";
  title: string;
  icon?: string;
  variant: string;
  full?: boolean;
};

const Button = ({ type, title, icon, variant, full }: ButtonProps) => {
  return (
    <button
      className={`flexCenter gap-3 rounded-full border ${variant} ${full && "w-full"
        }`}
      type={type}
    >
      {icon && <Image src={icon} alt={title} width={15} height={15} className="h-auto" />}
      <label className="cursor-pointer bold-16 whitespace-nowrap">
        {title}
      </label>
    </button>
  );
};

export default Button;
