import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "top-buffer": {
        "marginTop": 30
    },
    "inlineBlock": {
        "display": "inline-block"
    },
    "photo": {
        "height": 300,
        "width": "auto"
    }
});