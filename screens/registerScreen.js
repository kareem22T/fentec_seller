import {
    StyleSheet, Text, TouchableOpacity, SafeAreaView, View, Image, TextInput, ScrollView, ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TimerMixin from 'react-timer-mixin';
import * as SecureStore from 'expo-secure-store';
import { AntDesign } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const BackgroundImage = () => {
    return (
        <Image source={require('./../assets/imgs/setting_bg.png')} style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
        }} />
    )
}

export default function Register({ navigation, route }) {
    const [currentLang, setCurrentLag] = useState('en')
    const translations = {
        "en": {
            "head": "already have an account?",
            "login": "Log in",
            "register": route.params.seller ? "Update Seller Data" : "Create Seller Account",
            "or": "or",
            "google_btn": "Continue with Google",
            "face_btn": "Continue with Facebook",
            "email_e": "Email",
            "phone": "Phone Number",
            "p_password": "Password"
        },
        "fr": {
            "head": "Vous avez déjà un compte?",
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
            "head": "هل لديك حساب؟",
            "login": "تسجيل الدخول",
            "register": "تسجيل",
            "or": "أو",
            "google_btn": "تابع بواسطة جوجل",
            "face_btn": "تابع بواسطة فيسبوك",
            "email_e": "البريد الالكتروني",
            "phone": "رقم الهاتف",
            "p_password": "كلمة المرور"
        }
    }
    const [screenContent, setScreenContent] = useState(translations.en);

    const [token, setToken] = useState(route.params.token);

    const [phonefocused, setPhonefocused] = useState(false);
    const handlePhoneFocus = () => {
        setPhonefocused(true);
    };

    const [passfocused, setPassfocused] = useState(false);
    const handlePassFocus = () => {
        setPassfocused(true);
    };

    const [passConfirmationfocused, setPassConfirmationfocused] = useState(false);
    const handlePassConfirmationFocus = () => {
        setPassConfirmationfocused(true);
    };

    const [emailfocused, setEmailfocused] = useState(false);
    const handleEmailFocus = () => {
        setEmailfocused(true);
    };
    const [email, setEmail] = useState(route.params.seller ? route.params.seller.email : "");

    const [NameFocused, setNamefocused] = useState(false);
    const handleNameFocus = () => {
        setNamefocused(true);
    };
    const [name, setName] = useState(route.params.seller ? route.params.seller.name : "");

    const [addressfocused, setAddressfocused] = useState(false);
    const handleAddressFocus = () => {
        setAddressfocused(true);
    };
    const [address, setAddress] = useState(route.params.seller ? route.params.seller.address : "");

    const [phone, setPhone] = useState(route.params.seller ? route.params.seller.phone : "");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');

    const registerMethod = async (token) => {
        setLoading(true)
        setErrors([])
        try {
            const response = await axios.post(`https://3051-102-47-220-241.ngrok-free.app/admin/` + (route.params.seller ? "update-seller" : "create-seller"), {
                seller_id: route.params.seller ? route.params.seller.id : null,
                name: name,
                address: address,
                email: email,
                phone: phone,
                password: password,
                password_confirmation: passwordConfirmation,
                api_password: 'Fentec@scooters.algaria'
            }, {
                headers: {
                    'AUTHORIZATION': `Bearer ${token}`
                }
            });

            if (response.data.status === true) {
                setErrors([]);
                setSuccessMsg(response.data.message);
                TimerMixin.setTimeout(() => {
                    setLoading(false);
                    navigation.push('Home')
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

    const [scrollY, setScrollY] = useState(0);

    const onScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setScrollY(offsetY);
    };
    useEffect(() => {
    }, []);

    return (
        <ScrollView style={styles.wrapper}>
            <BackgroundImage></BackgroundImage>
            <Text style={{
                position: 'absolute', top: scrollY + 50, right: 20, color: "#fff",
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
                position: 'absolute', top: scrollY + 50, right: 20, color: "#fff",
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
                <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })} style={{ width: '100%' }}>
                    <Text style={{ marginTop: 50, textAlign: 'left', width: "90%", fontFamily: 'Outfit_700Bold', color: "#539BFF" }}><AntDesign name="back" size={24} color="#539BFF" /> Back </Text>
                </TouchableOpacity>
                <View style={{ gap: 15, width: '100%', alignItems: 'center' }}>
                    <Text style={{ fontSize: 38, marginTop: 15, textAlign: 'center', fontFamily: 'Outfit_700Bold', color: "rgba(255, 115,0, 1)" }}>{route.params.seller ? "Edit Seller Data" : "Add New Seller"}</Text>
                    <TextInput
                        placeholder={"Name"}
                        onChangeText={setName}
                        value={name}
                        onFocus={() => handleNameFocus()}
                        onBlur={() => setNamefocused(false)}
                        style={[
                            styles.input,
                            NameFocused && {
                                borderColor: 'rgba(255, 115, 0, 1)',
                                borderWidth: 2
                            },
                            currentLang == 'ar' && {
                                textAlign: 'right',
                            },
                        ]}

                    />
                    <TextInput
                        placeholder={"Address"}
                        onChangeText={setAddress}
                        value={address}
                        onFocus={() => handleAddressFocus()}
                        onBlur={() => setAddressfocused(false)}
                        style={[
                            styles.input,
                            addressfocused && {
                                borderColor: 'rgba(255, 115, 0, 1)',
                                borderWidth: 2
                            },
                            currentLang == 'ar' && {
                                textAlign: 'right',
                            },
                        ]}

                    />
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
                        placeholder={screenContent.phone}
                        onChangeText={setPhone}
                        value={phone}
                        onFocus={() => handlePhoneFocus()}
                        onBlur={() => setPhonefocused(false)}
                        style={[
                            styles.input,
                            phonefocused && {
                                borderColor: 'rgba(255, 115, 0, 1)',
                                borderWidth: 2
                            },
                            currentLang == 'ar' && {
                                textAlign: 'right',
                            },
                        ]}

                    />
                    {route.params.seller && (
                        <Text style={{ width: "90%", fontFamily: 'Outfit_600SemiBold', textAlign: 'left', fontSize: 20, marginTop: 20 }}>
                            Change Password (optional)
                        </Text>
                    )}
                    <TextInput
                        placeholder={"New Password"}
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
                    <TextInput
                        placeholder={"Password Confirmation"}
                        onChangeText={setPasswordConfirmation}
                        value={passwordConfirmation}
                        secureTextEntry={true}
                        onFocus={() => handlePassConfirmationFocus()}
                        onBlur={() => setPassConfirmationfocused(false)}
                        style={[
                            styles.input,
                            passConfirmationfocused && {
                                borderColor: 'rgba(255, 115, 0, 1)',
                                borderWidth: 2
                            },
                            currentLang == 'ar' && {
                                textAlign: 'right',
                            },
                        ]}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={() => registerMethod(token)}>
                    <Text style={styles.button_text}>{screenContent.register}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    contianer: {
        minHeight: hp('100%') + 10,
        padding: 1.25 * 16,
        flexDirection: 'column',
        gap: 1 * 16,
        alignItems: 'center',
        flex: 1,
        width: '100%',
        zIndex: 3,
        justifyContent: 'space-between',
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
