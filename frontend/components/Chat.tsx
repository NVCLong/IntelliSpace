import { Loader, SendHorizonal } from 'lucide-react';
import { useContext } from 'react';
import { ChatContext } from '@/providers';
import { UserCircle } from '@phosphor-icons/react';
import { FiCodesandbox } from 'react-icons/fi';
import Typewriter from 'typewriter-effect';

const Chat = () => {
  const {
    sendPrompt,
    setPrompt,
    recentPrompt,
    prompt,
    isPending,
    isGenerating,
    output,
    showResult,
  } = useContext(ChatContext);

  const handleSendPrompt = () => {
    sendPrompt(prompt);
  };

  return (
    <div className="relative h-screen flex-1 pb-[15vh]">
      <div className="mx-auto max-w-[55rem]">
        {!showResult ? (
          <div className="no-scrollbar h-[calc(100vh-5.25rem)] overflow-y-scroll px-[5%] pb-40">
            <div className="flex p-5 text-4xl font-semibold my-14">
              <FiCodesandbox />
              <div className="ml-2">
                <span>
                  Hi, I'm <span className="italic font-bold">IntelliBot</span>
                  <br />
                  How can I help you today?
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-scrollbar h-[calc(100vh-5.25rem)]  px-[5%] pb-40">
            <div className="flex items-center gap-5 my-10">
              <div className="grid w-10 h-10 rounded-full shadow-md place-items-center bg-brand-100">
                <UserCircle
                  size={40}
                  weight="duotone"
                  className="text-brand-300"
                />
              </div>
              <p className="p-2 px-4 font-serif font-medium shadow-lg rounded-xl border-1 bg-white/40">
                {recentPrompt}
              </p>
            </div>

            <div className="flex items-start gap-5">
              <div className="grid h-10 min-w-10 place-items-center">
                <img
                  className={`-mt-[0.5625rem] aspect-square w-10 shadow-md duration-500 rounded-full h-10  ${
                    isPending
                      ? 'animate-pulse'
                      : isGenerating
                        ? 'animate-spin'
                        : 'rotate-0 [animation-play-state:pause]'
                  }`}
                  src="/icon.ico"
                  alt="IntelliBot icon"
                />
              </div>

              {isPending ? (
                <div className="flex flex-col w-full gap-2">
                  <hr className="mt-1.5 h-5 animate-background-pan rounded-md border-none bg-brand-100 bg-gradient-to-r from-[#9ed7ff] via-[#ffffff] to-[#9ed7ff] [animation-delay:100ms] [animation-duration:3s] [background-size:800px_50px]" />

                  <hr className="mt-1.5 h-5 animate-background-pan rounded-md border-none bg-brand-100 bg-gradient-to-r from-[#9ed7ff] via-[#ffffff] to-[#9ed7ff] [background-size:800px_50px] [animation-delay:200ms] [animation-duration:2s]" />

                  <hr className="mt-1.5 h-5 w-8/12 animate-background-pan rounded-md border-none bg-brand-100 bg-gradient-to-r from-[#9ed7ff] via-[#ffffff] to-[#9ed7ff] [background-size:800px_50px] [animation-delay:300ms] [animation-duration:4s]" />
                </div>
              ) : (
                <p className="font-medium leading-[1.8] font-serif rounded-xl border-1 bg-purple-200/30 p-2 px-4 shadow-lg">
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter
                        .typeString(output)
                        // .callFunction(() => {
                        //   console.log('String typed out!');
                        // })
                        // .callFunction(() => {
                        //   console.log('All strings were deleted');
                        // })
                        .start();
                    }}
                  />
                </p>
              )}
            </div>
          </div>
        )}

        <div className="absolute bottom-0 mx-auto w-full max-w-[55rem] px-5 pt-4 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-5 px-5 py-3 bg-gray-200 rounded-full shadow-lg">
            <input
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
              className="flex-1 font-serif text-black bg-transparent border-none outline-none"
              type="text"
              placeholder="Enter a prompt here"
              value={prompt}
              disabled={isGenerating}
            />

            <div className="flex items-center gap-5 text-brand-300">
              {!isGenerating && !!prompt ? (
                <SendHorizonal
                  onClick={handleSendPrompt}
                  className="cursor-pointer min-w-4 animate-fade-right animate-once animate-ease-in-out"
                  size={16}
                />
              ) : null}

              {isGenerating ? (
                <Loader className="min-w-4 animate-spin" size={16} />
              ) : null}
            </div>
          </div>

          <p className="mx-auto my-2 text-xs text-center text-gray-500 sm:text-sm ">
            IntelliBot's accuracy varies. Always verify.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
