import '../styles/button.scss'
import { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: Boolean
};

export function Button( { isOutlined = false, ...props}: ButtonProps ) {
    return(
        <button className={`button ${isOutlined ? 'outlined' : ''}`} 
        {...props}
        />
    )
}