import {
    StyleSheet, ScrollView, SafeAreaView, Text, View, TouchableOpacity, Image, TextInput, ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import TimerMixin from 'react-timer-mixin';


const BackgroundImage = () => {
    return (
        <Image source={require('./../assets/imgs/PT.png')} style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
        }} />
    )
}

export default function Login({ navigation }) {
    const [currentLang, setCurrentLag] = useState('ar')
    const translations = {
        "en": {
            "head": "Do not have an account?",
            "login": "Log in",
            "register": "Sign up",
            "or": "or",
            "google_btn": "Continue with Google",
            "face_btn": "Continue with Facebook",
            "email_e": "Email",
            "phone": "Phone Number",
            "p_password": "Password"
        },
        "fr": {
            "head": "Vous n'avez pas de compte??",
            "login": "Se connecter",
            "register": "s'inscrire",
            "or": "ou",
            "google_btn": "Continuez avec Google",
            "face_btn": "Continuez avec Facebook",
            "email_e": "E-mail",
            "phone": "Numéro de téléphone",
            "p_password": "Mot de passe"
        },
        "ar": {
            "head": "ليس لديك حساب؟",
            "login": "تسجيل الدخول",
            "register": "تسجيل",
            "or": "أو",
            "google_btn": "تابع بواسطة جوجل",
            "face_btn": "تابع بواسطة فيسبوك",
            "email_e": "البريد الالكتروني او رقم الهاتف",
            "phone": "رقم الهاتف",
            "p_password": "كلمة المرور"
        }
    }
    const [screenContent, setScreenContent] = useState(translations.ar);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailfocused, setEmailfocused] = useState(false);
    const handleEmailFocus = () => {
        setEmailfocused(true);
    };
    const [passfocused, setPassfocused] = useState(false);
    const handlePassFocus = () => {
        setPassfocused(true);
    };

    const getStoredLang = async () => {
        const storedLang = await SecureStore.getItemAsync('lang');
        if (storedLang) {
            setScreenContent(translations[storedLang])
            setCurrentLag(storedLang)
        }
    }

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');

    const loginMethode = async () => {
        setLoading(true)
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/sellers/login`, {
                emailorphone: email,
                password: password,
                api_password: 'Fentec@scooters.algaria'
            });

            if (response.data.status === true) {
                await SecureStore.setItemAsync('seller_token', response.data.data.token)
                setLoading(false);
                setErrors([]);
                setSuccessMsg(response.data.message);
                TimerMixin.setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    });

                }, 1500)
            } else {
                setLoading(false);
                setErrors(response.data.errors);
                TimerMixin.setTimeout(() => {
                    setErrors([]);
                }, 2000);
            }
        } catch (error) {
            setLoading(false);
            setErrors(["Server error, try again later."]);
            console.error(error);
        }
    }

    useEffect(() => {
    }, []);

    return (
        <ScrollView>
            <BackgroundImage></BackgroundImage>
            <Text style={{
                position: 'absolute', top: 50, right: 20, color: "#fff",
                padding: 1 * 16,
                marginLeft: 10,
                fontSize: 1 * 16,
                backgroundColor: '#e41749',
                fontFamily: 'Outfit_600SemiBold',
                borderRadius: 1.25 * 16,
                zIndex: 9999999999,
                display: errors.length ? 'flex' : 'none'
            }}>{errors.length ? errors[0] : ''}</Text>
            <Text style={{
                position: 'absolute', top: 50, right: 20, color: "#fff",
                padding: 1 * 16,
                marginLeft: 10,
                fontSize: 1 * 16,
                backgroundColor: '#12c99b',
                fontFamily: 'Outfit_600SemiBold',
                borderRadius: 1.25 * 16,
                zIndex: 9999999999,
                display: successMsg == '' ? 'none' : 'flex'
            }}>{successMsg}</Text>
            {loading && (
                <View style={{
                    width: '100%',
                    height: '100%',
                    zIndex: 336,
                    justifyContent: 'center',
                    alignContent: 'center',
                    marginTop: 22,
                    backgroundColor: 'rgba(0, 0, 0, .5)',
                    position: 'absolute',
                    top: 10,
                    left: 0,
                }}>
                    <ActivityIndicator size="200px" color="#ff7300" />
                </View>
            )}
            <View style={styles.contianer}>
                <Text style={{ fontSize: 38, textAlign: 'center', fontFamily: 'Outfit_700Bold', color: "#000", marginTop: 40 }}>سجل الدخول {'\n'}كبائع نقاط</Text>
                <Image source={require('./../assets/imgs/login_splash.png')} style={{
                    width: "90%",
                    height: 400,
                    resizeMode: 'contain',
                }} />
                <View style={{ gap: 15, width: '100%', alignItems: 'center' }}>
                    <TextInput
                        placeholder={screenContent.email_e}
                        onChangeText={setEmail}
                        value={email}
                        onFocus={() => handleEmailFocus()}
                        onBlur={() => setEmailfocused(false)}
                        style={[
                            styles.input,
                            emailfocused && {
                                borderColor: 'rgba(255, 115, 0, 1)',
                                borderWidth: 2
                            },
                            currentLang == 'ar' && {
                                textAlign: 'right',
                            },
                        ]}

                    />
                    <TextInput
                        placeholder={screenContent.p_password}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry={true}
                        onFocus={() => handlePassFocus()}
                        onBlur={() => setPassfocused(false)}
                        style={[
                            styles.input,
                            passfocused && {
                                borderColor: 'rgba(255, 115, 0, 1)',
                                borderWidth: 2
                            },
                            currentLang == 'ar' && {
                                textAlign: 'right',
                            },
                        ]}
                    />
                    <TouchableOpacity style={styles.button} onPress={() => loginMethode()}>
                        <Text style={styles.button_text}>{screenContent.login}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contianer: {
        padding: 1.25 * 16,
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 1 * 16,
        alignItems: 'center',
        flex: 1,
        width: '100%',
        zIndex: 3,
        padding: 10
    },
    main_img: {
        width: 130,
        height: 80,
        resizeMode: 'contain',
        opacity: 1,
        marginTop: 10
    },
    or: {
        fontSize: 1.5 * 16,
        lineHeight: 2 * 16,
        textAlign: "center",
        fontFamily: 'Outfit_600SemiBold',
    },
    input: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.25 * 16,
        lineHeight: 1.5 * 16,
        textAlign: 'left',
        padding: 1.25 * 16,
        borderRadius: 1.25 * 16,
        backgroundColor: "#fff",
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        width: "95%",
    },
    button: {
        padding: 18,
        borderRadius: 1.25 * 16,
        fontSize: 1.25 * 16,
        width: "95%",
        backgroundColor: "#ff7300",
        transition: "all .3s ease-in",
        marginBottom: 1.25 * 16,
    },
    button_text: {
        color: "#fff",
        fontFamily: 'Outfit_700Bold',
        fontSize: 28,
        textAlign: "center",
    },
    g_f_img: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
    g_btn: {
        backgroundColor: "#fff",
        padding: 1.25 * 16,
        borderRadius: 1.25 * 16,
        display: "flex",
        justifyContent: 'start',
        alignItems: "center",
        flexDirection: 'row',
        gap: 1.25 * 16,
        width: "100%",
        color: '#000',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    f_btn: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        padding: 1.25 * 16,
        borderRadius: 1.25 * 16,
        display: "flex",
        justifyContent: 'start',
        alignItems: "center",
        flexDirection: 'row',
        gap: 1.25 * 16,
        width: "100%",
        backgroundColor: '#1877f2',

    },
    g_btn_text: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.1 * 16,
        textAlign: "center",
        lineHeight: 1.25 * 16,
        color: '#000'
    },
    f_btn_text: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.1 * 16,
        textAlign: "center",
        lineHeight: 1.25 * 16,
        color: '#fff'
    },
    question: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 1.25 * 16,
        lineHeight: 1.5 * 16,
        textAlign: "center",
        color: "#000",
    },
    ans: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.25 * 16,
        textAlign: "center",
        color: "#ff7300",

    }
});
