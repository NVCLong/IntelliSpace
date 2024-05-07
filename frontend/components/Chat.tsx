import {
	Code,
	Compass,
	DraftingCompass,
	ImagePlus,
	Lightbulb,
	Loader,
	Mic,
	SendHorizonal,
	UserRound,
} from 'lucide-react';
import { useContext } from 'react';

import { ChatContext } from '@/providers';

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
		<div className='relative h-screen flex-1 pb-[15vh]'>

			<div className='mx-auto max-w-[55rem]'>
				{!showResult ? (
					<div className='no-scrollbar h-[calc(100vh-5.25rem)] overflow-y-scroll px-[5%] pb-40'>
						<div className='p-5 text-6xl font-medium my-14'>
							<p className='text-brand-400'>
								<span className='bg-gradient-to-br bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
									Hello, IntelliBot user
								</span>

								<span className='block'>How can I help you today?</span>
							</p>
						</div>
					</div>
				) : (
					<div className='no-scrollbar h-[calc(100vh-5.25rem)] overflow-y-scroll px-[5%] pb-40'>
						<div className='flex items-center gap-5 my-10'>
							<div className='grid w-10 h-10 rounded-full place-items-center bg-brand-100'>
								<UserRound className='icon text-brand-300' />
							</div>

							<p>{recentPrompt}</p>
						</div>

						<div className='flex items-start gap-5'>
							<div className='grid h-10 min-w-10 place-items-center'>
								<img
									className={`-mt-[0.5625rem] aspect-square w-7 duration-500 ${
										isPending
											? 'animate-pulse'
											: isGenerating
												? 'animate-spin'
												: 'rotate-0 [animation-play-state:pause]'
									}`}
									src='/gemini.svg'
									alt='gemini icon'
								/>
							</div>

							{isPending ? (
								<div className='flex flex-col w-full gap-2'>
									<hr
										className={`mt-1.5 h-5 animate-background-pan rounded-md border-none bg-brand-100 bg-gradient-to-r from-[#9ed7ff] via-[#ffffff] to-[#9ed7ff] [animation-delay:100ms] [animation-duration:3s] [background-size:800px_50px]`}
									/>

									<hr
										className={`mt-1.5 h-5 animate-background-pan rounded-md border-none bg-brand-100 bg-gradient-to-r from-[#9ed7ff] via-[#ffffff] to-[#9ed7ff] [background-size:800px_50px] [animation-delay:200ms] [animation-duration:2s]`}
									/>

									<hr
										className={`mt-1.5 h-5 w-8/12 animate-background-pan rounded-md border-none bg-brand-100 bg-gradient-to-r from-[#9ed7ff] via-[#ffffff] to-[#9ed7ff] [background-size:800px_50px] [animation-delay:300ms] [animation-duration:4s]`}
									/>
								</div>
							) : (
								<p
									className='font-light leading-[1.8]'
									dangerouslySetInnerHTML={{ __html: output }}
								/>
							)}
						</div>
					</div>
				)}

				<div className='absolute bottom-0 mx-auto w-full max-w-[55rem] px-5 pt-4 backdrop-blur-sm'>
					<div className='flex items-center justify-between gap-5 px-5 py-3 bg-gray-200 rounded-full'>
						<input
							onChange={(e) => {
								setPrompt(e.target.value)}}
							onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
							className='flex-1 text-black bg-transparent border-none outline-none'
							type='text'
							placeholder='Enter a prompt here'
							value={prompt}
							disabled={isGenerating}
						/>

						<div className='flex items-center gap-5 text-brand-300'>

							{!isGenerating && !!prompt ? (
								<SendHorizonal
									onClick={() => handleSendPrompt}
									className='min-w-4'
									size={16}
								/>
							) : null}

							{isGenerating ? (
								<Loader className='min-w-4 animate-spin' size={16} />
							) : null}
						</div>
					</div>

					<p className='mx-auto my-3 text-xs font-light text-center text-brand-300 sm:text-sm'>
						IntelliBot may display inaccurate info, including about people, so
						double-check its responses.
					</p>
				</div>
			</div>
		</div>
	);
};

export default Chat;
