import LoginForm from "@/components/auth/LoginForm";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className='h-full flex justify-center align-center items-center'>
			<LoginForm />
			{/* <SignIn /> */}
		</div>
	);
}
