import React,{useState} from 'react';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {registerUser} from '../../../_actions/user_action';
import {withRouter} from 'react-router-dom';

function RegisterPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [Name, setName] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    }
    
    const onSubmitHandler = (event) => {
        event.preventDefault();

        if(Password !== ConfirmPassword){
            return alert('비밀번호와 비밀번호 확인 불일치')
        }

        let body = {
            email : Email,
            password : Password,
            name : Name
        }

        dispatch(registerUser(body))
        .then(response => {
            if(response.payload.success){
                console.log(response)
                props.history.push('/login')
            }else{
                alert('Failed to sign up')
            }
        })
        
    }

    

  

    return (
        <div style={{
            display : 'flex', justifyContent : 'center', alignItems : 'center', 
            width : '100%', height : '100vh'
        }}>
            <form style={{display : 'flex', flexDirection:'column'}} 
                onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>name</label>
                <input type="text" value={Name} onChange={onNameHandler} />
                <label>Password</label>
                <input type="passowrd" value={Password} onChange={onPasswordHandler}/>
                <label>Confirm Password</label>
                <input type="passowrd" value={ConfirmPassword} onChange={onConfirmPasswordHandler}/>
                <br/>
                <button>
                    회원가입
                </button>
            </form>
        </div>
    )
}

export default withRouter(RegisterPage)