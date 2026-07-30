import { Box, Button, Typography } from "@mui/material";
import { BackgroundBox } from "../styled_comp/StyledDiv";
import { useState } from "react";
import StepInput from "./StepInput";
import { userApi } from "../../api/services/user";
import { useAuth } from '../../hooks/useAuth';

const Step = ({title, inputData, step, setStep, joinData, setJoinData, goJoin, lastStep = false}) => {
    const { loginUser } = useAuth()
    const [error, setError] = useState();
    const [pass, setPass] = useState(false);

    const goNext = (e) => {
        setStep(step+1);
        setPass(false);
    }

    const goPrev = () => {
        setStep(step-1);
    }

    const bodyShape = {
        male : ['표준 체형','작은 역삼각 체형','사각 체형','큰 사각 체형'],
        female: ['표준 체형','작은 역삼각 체형','역삼각 체형', '삼각 체형', '사각 체형']
    }

    const addJoinData = (e) => {
        const { name, value } = e.target;
        const nextJoinData = {...joinData, [name]: value};
        if (name === 'email') {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
            if (!emailRegex.test(value) || !value ) {
                setError('이메일 형식에 맞게 입력해 주세요.');
                setPass(false)
            } else {
                setError();
                setPass(true);
            }
        }
        if (name === 'password') {
            const passwordRegex = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{5,})\S$/;
            if (!passwordRegex.test(value)) {
                setError('비밀번호 형식에 맞게 입력해 주세요.')
                setPass(false)
            } else {
                setError();
                setPass(true);
            }
        }
        if (name === 'pwdchk') {
            if (nextJoinData.password !== value) {
                setError('비밀번호를 동일하게 입력해 주세요.')
                setPass(false)
            } else {
                setError();
                setPass(true);
            }
        }
        if (name === 'gender' || name === 'birthday' || name === 'height' || name === 'weight') {
            if(nextJoinData.birthday && nextJoinData.gender && nextJoinData.height && nextJoinData.weight){
                if(new Date(nextJoinData.birthday) > new Date()){
                    setError('시간여행자다~~👽')
                    setPass(false)
                } else {
                    setError();
                    setPass(true);
                }
            } else {
                setError('값을 전부 입력해 주세요.');
                setPass(false)
            }
        }
        if (name === 'bodyshape') {
            if(nextJoinData.bodyshape){
                setError();
                setPass(true);
            } else {
                setError('체형을 선택해 주세요.');
                setPass(false)
            }
        }
        if (name === 'img' || name === 'user_name') {
            if(nextJoinData.user_name.trim()){
                setError();
                setPass(true);
            } else {
                setError('값을 전부 입력해 주세요.');
                setPass(false)
            }
        }
        setJoinData(nextJoinData);
    }

    const uploadProfileImage = async(e) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        const profileData = new FormData();
        profileData.append('img', file);
        const result = await userApi.uploadUserImg(profileData);
        if (result.code === 200) {
            const nextJoinData = {...joinData, [e.target.name]: result.img};
            setJoinData(nextJoinData);
            setPass(Boolean(nextJoinData.user_name.trim()));
        }
    }
    return ( 
        <Box
        sx={{
            minHeight: "100vh",
            display: "flex",
            width: "100%",
            flexWrap: "wrap",
            overflowY: "scroll",
            scrollbarWidth: "none",
            alignItems: "center",
            position: 'relateve',
            margin: "16px 0",
            flexDirection: "column",
            justifyContent:'center',
            alignItems:'center'
        }}
            
        >
            <Typography variant="h5" fontWeight={800}>{title}</Typography>
            <BackgroundBox
                display='flex'
                style={{
                    width:'90%',
                    marginTop:'36px',
                    padding: '16px',
                    justifyContent: 'space-around'
                }}
            >
                <StepInput inputData={inputData} joinData={joinData} addJoinData={addJoinData} bodyShape={bodyShape} uploadProfileImage={uploadProfileImage} error={error}/>
                { step > 1 &&
                <Button onClick={goPrev} variant="contained" color="white" style={{ padding: '6px 36px'}}>이전으로</Button>
                }
                { !lastStep ? 
                <Button disabled={!pass} onClick={goNext} variant="contained" color="secondary" style={{ padding: '6px 36px'}}>계속하기</Button>
                :
                <Button disabled={!pass} onClick={goJoin} variant="contained" color="secondary" style={{ padding: '6px 36px'}}>완료하기</Button>
                }
            </BackgroundBox>
            {!loginUser &&
                <Button variant="text" href="/login" color="white" style={{textDecoration:"underline"}}>이미 계정이 있으신가요?</Button>
            }
        </Box>
    );
}

export default Step;
