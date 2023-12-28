import {
    StyleSheet, Text, TouchableOpacity, SafeAreaView, View, Image, TextInput, ScrollView, ActivityIndicator, Modal, Button
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Octicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import TimerMixin from 'react-timer-mixin';
import Nav from './../components/nav'
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

export default function History({ navigation }) {
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentLang, setCurrentLag] = useState('en')
    const [user, setUser] = useState(null)
    const [sellers, setSellers] = useState([])
    const [notificationToken, setNotificationToken] = useState('')
    const [token, setToken] = useState('')

    const getStoredToken = async () => {
        const seller_token = await SecureStore.getItemAsync('seller_token');
        if (seller_token)
            return seller_token

        return '';
    }

    const getUser = async (token) => {
        setErrors([])
        try {
            const response = await axios.post(`https://3051-102-47-220-241.ngrok-free.app/sellers/get-user`, {
                api_password: 'Fentec@scooters.algaria',
            },
                {
                    headers: {
                        'AUTHORIZATION': `Bearer ${token}`
                    }
                },);

            if (response.data.status === true) {
                setLoading(false);
                setErrors([]);
                setUser(response.data.data.seller);
                console.log(response.data.data.seller);
                return response.data.data.seller;
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

    const showScreens = (user, token) => {
        if (!user) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } else {
            setLoading(false)
        }
    }

    useEffect(() => {

        getStoredToken().then((res) => {
            let token = res
            if (token) {
                setToken(token)
                getUser(token).then((user) => {
                    showScreens(user, token)
                })
            } else {
                showScreens(res)
            }
        });

    }, []);

    return (
        <SafeAreaView style={[styles.wrapper]}>
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
                    zIndex: 9999999999,
                    justifyContent: 'center',
                    alignContent: 'center',
                    marginTop: 10,
                    backgroundColor: '#fff',
                    position: 'absolute',
                    top: 10,
                    left: 0,
                }}>
                    <ActivityIndicator size="200px" color="#ff7300" />
                </View>
            )}
            <Nav navigation={navigation} active={2} />
            <ScrollView>
                <View style={styles.container}>
                    {user && (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', gap: 15 }}>
                                    <Octicons name="history" size={80} color='rgba(255, 115, 0, 1)' style={{ marginTop: 70 }} />
                                    <Text style={{ fontSize: 30, fontFamily: 'Outfit_700Bold', color: '#000', textAlign: 'center' }}>سجل البيع</Text>
                                </View>
                                <View>
                                    <Text style={[styles.title, { marginTop: 16 }]}>نقاط لم يتم تسديدها</Text>
                                    <Text style={{ fontSize: 30, fontFamily: 'Outfit_700Bold', color: 'rgba(255, 115, 0, 1)', textAlign: 'center' }}>{user.unbilled_points}</Text>
                                </View>
                            </View>
                            <Text>{'\n'}</Text>
                            {user.history.length === 0 &&
                                (
                                    <View>
                                        <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 18, textAlign: 'center' }}>{search ? "No results" : "There are no sellers yet."}</Text>
                                    </View>
                                )}

                            {
                                user.history.length > 0 &&
                                (
                                    <View style={styles.tbody}>
                                        {user.history.map((result) => (
                                            <View style={styles.result} key={result.id}>
                                                <Text style={styles.result_txt}>{result.recipient}</Text>
                                                <Text style={styles.result_txt}>{new Date(result.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' - ' + new Date(result.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text>
                                                <Text style={[styles.result_txt, { fontFamily: "Outfit_700Bold", color: 'rgba(255, 115, 0, 1)' }]}>{result.amount}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )
                            }
                        </View>
                    )}
                </View>
                <View style={{ height: 160 }}></View>
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        marginTop: 70
    },
    button: {
        padding: 18,
        borderRadius: 1.25 * 16,
        fontSize: 1.25 * 16,
        width: "90%",
        backgroundColor: "#ff7300",
        transition: "all .3s ease-in",
        marginBottom: 1.25 * 16,
    },
    contianer: {
        padding: '1.25rem',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        zIndex: 3,
        gap: 10,
        paddingBottom: 160
    },
    title: {
        fontSize: 30,
        fontFamily: 'Outfit_500Medium',
        textAlign: 'center',
        marginTop: 90
    },
    label: {
        fontSize: 30,
        fontWeight: '700',
        lineHeight: 38,
        letterSpacing: 0,
        textAlign: 'center',
        fontFamily: 'Outfit_700Bold',
        marginTop: 15,
        marginBottom: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, .5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '90%',
        padding: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    approvingAlert: {
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ab002b",
        backgroundColor: '#e41749',
        width: '90%',
        fontFamily: 'Outfit_400Regular',
        color: '#fff',
        fontSize: 16
    },
    profile: {
        // padding: 16,
        paddingTop: 16,
        paddingBottom: 16,
        width: '90%',
        gap: 1.25 * 16,
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        // marginTop: 100
    },
    head: {
        alignItems: "center",
        justifyContent: "center",
        gap: 16
    },
    profile_img: {
        width: 16 * 7,
        height: 16 * 7,
        borderRadius: 8 * 7,
        resizeMode: "cover"
    },
    name: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 22,
        textAlign: 'center'
    },
    details: {
        width: '100%',
        flexDirection: "row",
        justifyContent: 'center',
        gap: 1.25 * 16
    },
    trips: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        color: 'black',
        width: '40%',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        gap: 10
    },
    trips_text: {
        fontSize: 1.25 * 16,
        fontFamily: 'Outfit_400Regular',
        textAlign: 'center',
    },
    bg: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        height: "85%",
        backgroundColor: '#ffffff', // Replace with your desired background color
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    contianer_bg: {
        width: '90%',
        backgroundColor: '#ffffff', // Replace with your desired background color
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        padding: 10,
        marginBottom: 10,
        marginTop: 10,
        gap: 10
    },
    navigate_Text: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 18,
        textAlign: 'center',
        margin: 5,
        color: 'rgba(255, 115, 0, 1)'
    },
    btn: {
        paddingTop: 16,
        paddingBottom: 18,
        borderRadius: 1.25 * 16,
        backdropFilter: "blur(1)",
        width: "90%",
        backgroundColor: "#ff7300",
        transition: "all .3s ease-in",
        border: "3 solid #ff7300",
        // marginBottom: 1.25 * 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button_text: {
        color: "#fff",
        fontFamily: 'Outfit_700Bold',
        fontSize: 28,
        textAlign: "center",
    },
    how_container: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20
    },
    how_element: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#ffffff', // Replace with your desired background color
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        padding: 14,
        marginBottom: 10,
        marginTop: 10,
        gap: 10,
        width: '48%'
    },
    table_head: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "100%",
        alignItems: 'center'
    },
    input: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 16,
        lineHeight: 1.2 * 16,
        textAlign: 'left',
        padding: 10,
        paddingLeft: 15,
        borderRadius: 16,
        backgroundColor: "#fff",
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        width: 180,
    },
    result_txt: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.15 * 16,
        // fontWeight: 600,
        lineHeight: 1.5 * 16,
        textAlign: 'left',
    },
    result: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.25 * 16,
        // fontWeight: 600,
        lineHeight: 1.5 * 16,
        textAlign: 'left',
        padding: 1.5 * 16,
        borderRadius: 1.25 * 16,
        backgroundColor: "rgba(255, 255, 255, 1)",
        width: "92%",
        color: 'gray',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        margin: 3,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    add_btn: {
        fontSize: 16,
        lineHeight: 1.2 * 16,
        textAlign: 'left',
        padding: 10,
        paddingLeft: 15,
        borderRadius: 16,
        backgroundColor: "#fff",
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        fontFamily: 'Outfit_600SemiBold',
        backgroundColor: 'rgba(255, 115, 0, 1)',
        color: '#fff',
        borderRadius: 10
    },
    table_wrapper: {
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '90%',
        padding: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    table: {
        width: "100%",
        gap: 16
    },
    input: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.25 * 16,
        // fontWeight: 600,
        lineHeight: 1.5 * 16,
        textAlign: 'left',
        padding: 1.5 * 16,
        borderRadius: 1.25 * 16,
        backgroundColor: "rgba(255, 255, 255, 1)",
        width: "90%",
        color: 'gray',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    input_text: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.5 * 16,
        textAlign: 'left',
    },

    thead: {
        padding: 10,
        paddingBottom: 0,
        gap: 10,
        marginTop: 15
    },
    tr: {
        flexDirection: "row",
        gap: 10,
        justifyContent: 'space-between',
        borderBlockColor: '#d5dfe4',
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    th: {
        width: 'auto'
    },
    th_text: {
        fontSize: 15,
        fontFamily: 'Outfit_600SemiBold',
    },
    tbody: {
        padding: 10,
        gap: 10,
    },
    td: {
        width: 'auto'
    },
    td_text: {
        fontSize: 15,
        fontFamily: 'Outfit_500Medium',
        width: '100%'
    },
    td_text_first: {
        width: 200,
    }
});