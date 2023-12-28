import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import * as React from 'react';
import { Feather, Octicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

export default function Nav(props) {
    navigation = props.navigation
    const [serialNumfocused, setSerialNumfocused] = useState(false);
    return (
        <View style={styles.wrapper}>
            <View style={styles.contianer}>
                <TouchableOpacity style={[styles.choiceWrapper, props.active == 1 && styles.choiceActive]} onPress={() => navigation.push('Home')}>
                    <Feather name="send" size={40} color={props.active == 1 ? 'rgba(255, 115, 0, 1)' : 'black'} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.choiceWrapper, props.active == 2 && styles.choiceActive]} onPress={() => navigation.push('History')}>
                    <Octicons name="history" size={40} color={props.active == 2 ? 'rgba(255, 115, 0, 1)' : 'black'} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.choiceWrapper, props.active == 2 && styles.choiceActive, { display: 'none' }]} onPress={() => navigation.push('History')}>
                    <Octicons name="history" size={40} color={props.active == 2 ? 'rgba(255, 115, 0, 1)' : 'black'} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        paddingBottom: 35,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        position: 'absolute',
        zIndex: 999,
        gap: 15
    },
    contianer: {
        width: '55%',
        padding: 15,
        borderRadius: 25,
        backgroundColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    choiceWrapper: {
        padding: 20,
        borderRadius: 16,
    },
    choiceActive: {
        backgroundColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
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
        width: "78%",
    },
});
