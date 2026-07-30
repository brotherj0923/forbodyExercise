import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";
import { userApi } from "../api/services/user";

const userProfileCache = new Map();
const userProfileRequestCache = new Map();
const modelProfileCache = new Map();
const modelProfileRequestCache = new Map();

const useUserandRoleModel = (options = {}) => {
    const token = localStorage.getItem("token");
    const { loginUser, getUserInfoByToken } = useAuth();
    const includeRoleModel = options.includeRoleModel !== false;
    
    const [userProfile, setUserProfile] = useState(null);
    const [modelProfile, setModelProfile] = useState(null);
    const [userImg, setUserImg] = useState("");
    const [modelImg, setModelImg] = useState("");

    // user 정보 가져오기
    const getUserInfo = async () => {
        try {
            if (!loginUser) {
                return;
            }

            if (userProfileCache.has(loginUser)) {
                setUserProfile(userProfileCache.get(loginUser));
                return;
            }

            let request = userProfileRequestCache.get(loginUser);
            if (!request) {
                request = getUserInfoByToken()
                    .then((profile) => {
                        if (profile) {
                            userProfileCache.set(loginUser, profile);
                        }
                        userProfileRequestCache.delete(loginUser);
                        return profile;
                    })
                    .catch((err) => {
                        userProfileRequestCache.delete(loginUser);
                        throw err;
                    });
                userProfileRequestCache.set(loginUser, request);
            }

            const up = await request;
            if (up) {
                setUserProfile(up);
            }
        } catch (err) {
            console.error("Error fetching user info: ", err);
        }
    };

    // user 이미지 가져오기
    const getUserImg = async () => {
        try {
            if (userProfile) {
                const ud = userProfile.UserDetail;
                const lastProfile = ud.length
                setUserImg(ud[lastProfile-1]?.img)
            }
        } catch (err) {
            console.error("Error fetching user info: ", err);
        }
    };

    // rolemodel 정보 가져오기
    const getModelInfo = async () => {
        try {
            if (userProfile?.role_model_id && token) {
                const role_model = userProfile.role_model_id;
                const cacheKey = `${token}:${role_model}`;

                if (modelProfileCache.has(cacheKey)) {
                    setModelProfile(modelProfileCache.get(cacheKey));
                    return;
                }

                let request = modelProfileRequestCache.get(cacheKey);
                if (!request) {
                    request = userApi.getUser(`${role_model}`, token)
                        .then((res) => {
                            if (res.payload) {
                                modelProfileCache.set(cacheKey, res.payload);
                            }
                            modelProfileRequestCache.delete(cacheKey);
                            return res.payload;
                        })
                        .catch((err) => {
                            modelProfileRequestCache.delete(cacheKey);
                            throw err;
                        });
                    modelProfileRequestCache.set(cacheKey, request);
                }

                const res = await request;
                if (res) {
                    setModelProfile(res);
                }
            }
        } catch (err) {
            console.error("Error fetching model info: ", err);
        }
    };

    // rolemodel 이미지 가져오기
    const getModelImg = async () => {
        try {
            if (modelProfile) {
                const md = modelProfile.UserDetail;
                const lastProfile = md.length;
                setModelImg(md[lastProfile - 1]?.img);
            }
        } catch (err) {
            console.error("Error fetching model info: ", err);
        }
    };

    useEffect(() => {
        if (loginUser) {
            getUserInfo();
        }
    }, [loginUser]);

    useEffect(() => {
        if (userProfile) {
            getUserImg();
            if (includeRoleModel) {
                getModelInfo();
            }
        }
    }, [userProfile, includeRoleModel]);

    useEffect(() => {
        if (modelProfile) {
            getModelImg();
        }
    }, [modelProfile]);

    return { userProfile, userImg, modelProfile, modelImg };
};
export default useUserandRoleModel;
