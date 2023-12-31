import RegisterForm from "@/components/auth/RegisterForm";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className='h-full flex justify-center align-center items-center '>
			<RegisterForm />
		</div>
	);
}
