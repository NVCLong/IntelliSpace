import { useTypewriter } from '@/lib/hooks/useTypeWriter';

// @ts-ignore
const Typewriter = ({ text, speed }) => {
  const displayText = useTypewriter(text, speed);

  return <p>{displayText}</p>;
};

export default Typewriter;
