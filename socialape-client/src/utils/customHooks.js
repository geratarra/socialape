import { useState } from 'react';

export const useForm = () => {
    const [inputs, setInputs] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        handle: '',
        body: ''
    });
    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
    };
    return {
        inputs,
        handleInputChange
    };
};