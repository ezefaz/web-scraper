import { SignIn } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className='h-full flex justify-center align-center items-center pt-[20rem]'>
			<SignIn />
		</div>
	);
}
