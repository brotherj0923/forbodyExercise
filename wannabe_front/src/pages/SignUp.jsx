import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from 'sweetalert2';
import male from "../assets/MaleBodyShape.JPG";
import female from "../assets/FemaleBodyShape.JPG";
import axios from 'axios';
import Step from "../components/signup/Step";
import { useAuth } from "../hooks/useAuth";
import { API_URL } from "../api/url";

const SignUp = () => {
    const navigate = useNavigate();
    const { goToErrPage } = useAuth();
    const [step, setStep] = useState(1);
    const [joinData, setJoinData] = useState({
        email: "",
        password: "",
        pwdchk: "",
        gender: "",
        birthday: "",
        height: "",
        weight: "",
        bodyshape: "",
        img: "",
        user_name: "",
    });
    
    const goJoin = (async () => {
        const { email,
            password,
            pwdchk,
            gender,
            birthday,
            height,
            weight,
            bodyshape,
            img,
            user_name } = joinData
        try {
            if (
                email && 
                password && 
                pwdchk && 
                (password === pwdchk) && 
                gender && 
                birthday && 
                height &&
                weight && 
                bodyshape &&
                img && 
                user_name) {
                const res = await axios.post(`${API_URL}/auth/join`, {
                    email,
                    user_name,
                    password,
                    gender,
                    birthday,
                    height,
                    weight,
                    bodyshape,
                    img,
                    
                })
                if (res.data.code === 200) {
                    Swal.fire({
                        title: "회원가입을 축하합니다!",
                        text: res.data.message,
                        icon: "success"
                    });
                    navigate('/login');
                } else {
                    throw new Error(res.data.message);
                }
            } else {
                throw new Error("입력값을 확인해주세요");
            }
        } catch (err) {
            goToErrPage(err, () => navigate('/err'));
        }
    });
    let stepComp;

    if (step === 1) {
        stepComp = (
            <>
                <Step title="이메일 입력"
                    inputData={[
                        {"inputName":"email", "type":"email", "message":"먼저, 이메일을 입력해 주세요 😊", "label":"이메일" }
                    ]} 
                    step={step} setStep={setStep} joinData={joinData} setJoinData={setJoinData} />
            </>
        );    
    } else if (step === 2) {
        stepComp = (
            <>
                <Step title="비밀번호 입력" 
                    inputData={[
                        {"inputName":"password", "type":"password", "message":"비밀번호는 대소문자와 숫자를 포함하여 6자 이상 입력해 주세요.", "label":"비밀번호" },
                        {"inputName":"pwdchk", "type":"password", "message":"비밀번호를 다시 한번 입력해 주세요.", "label":"비밀번호 확인" },
                    ]}
                    step={step} setStep={setStep} joinData={joinData} setJoinData={setJoinData} />
            </>
        )
    } else if (step === 3) {
        stepComp = (
            <>
                <Step title="개인정보 입력" 
                    inputData={[
                        {"inputName":"gender", "type":"radio", "message":"성별을 입력해 주세요.", "label":"성별" },
                        {"inputName":"birthday", "type":"date", "message":"생일을 입력해 주세요.", "label":"생일" },
                        {"inputName":"height", "type":"tel", "message":"키를 입력해 주세요.", "label":"키" },
                        {"inputName":"weight", "type":"tel", "message":"몸무게를 입력해 주세요.", "label":"몸무게" },
                    ]}
                    step={step} setStep={setStep} joinData={joinData} setJoinData={setJoinData} />
            </>
            
        )
    } else if (step === 4) {
        stepComp = (
            <>
                <Step title="맞춤 추천정보 입력" 
                    inputName="bodyshape" label="체형" 
                    inputData={[
                        {"img": joinData.gender === "M" ? male : female, "inputName":"bodyshape", "type":"checkbox", "message":"나에게 가장 적절한 체형을 선택해 주세요.", "label":"체형" },
                    ]}
                    step={step} setStep={setStep} joinData={joinData} setJoinData={setJoinData} />
            </>
        )
    } else {
        stepComp = (
            <>
                <Step title="프로필 설정"
                    inputData={[
                        {"inputName":"img", "type":"file", "accept":"image/*", "message":"프로필 사진을 등록해 주세요.", "label":"프로필 사진" },
                        {"inputName":"user_name", "type":"text", "message":"이름을 입력해 주세요.", "label":"이름" },
                    ]}
                    lastStep={true} step={step} setStep={setStep} joinData={joinData} setJoinData={setJoinData} goJoin={goJoin}/>
            </>
        );
    }
    return stepComp;
}

export default SignUp;
