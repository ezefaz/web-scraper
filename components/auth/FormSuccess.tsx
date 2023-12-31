import React from "react";
import { FaCheckCircle } from "react-icons/fa";

type Props = {
	message: string | undefined;
};

const FormSuccess: React.FC<Props> = ({ message }) => {
	return (
		<div className='flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md'>
			<FaCheckCircle className='mr-2' />
			<span>{message}</span>
		</div>
	);
};

export default FormSuccess;
