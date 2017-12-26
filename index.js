import React, {Component} from 'react'

import {findNodeHandle, NativeModules, TextInput} from 'react-native'

const applyMask = NativeModules.RNTextInputMask.mask;
const unmask = NativeModules.RNTextInputMask.unmask;
const setMask = NativeModules.RNTextInputMask.setMask;
export {applyMask as mask, unmask, setMask}

export default class TextInputMask extends Component {
    static defaultProps = {
        maskDefaultValue: true,
        onChangeText: () => false, // NoOp
        refInput: () => false, // NoOp
    };

    masked = false;

    componentDidMount() {
        const {maskDefaultValue, mask, value} = this.props;

        if (maskDefaultValue && mask && value) {
            applyMask(mask, `${value}`, this.setInputTextNativeProp)
        }

        if (mask && !this.masked) {
            this.masked = true;
            setMask(findNodeHandle(this.input), mask);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value || this.props.mask !== nextProps.mask) {
            applyMask(nextProps.mask, `${nextProps.value}`, this.setInputTextNativeProp);
        }

        if (this.props.mask !== nextProps.mask) {
            this.masked = true;
            setMask(findNodeHandle(this.input), nextProps.mask);
        }
    }

    setInputTextNativeProp = (text) => {
        if (this.input) {
            this.input.setNativeProps({text});
        }
    };

    saveInputRef = (ref) => {
        this.input = ref;
        this.props.refInput(ref);
    };

    handleChange = (masked) => {
        unmask(this.props.mask, masked, (unmasked) => this.props.onChangeText(masked, unmasked))
    };

    render() {
        return (
            <TextInput
                {...this.props}
                value={undefined}
                ref={this.saveInputRef}
                onChangeText={this.handleChange}
            />
        );
    }
}
