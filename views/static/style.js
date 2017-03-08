import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "body": {
        "fontFamily": "nagomigokubosogothic",
        "color": "black",
        "backgroundColor": "#FFFFFF"
    },
    "top-buffer": {
        "marginTop": 30
    },
    "inlineBlock": {
        "display": "inline-block"
    },
    "nonInlineBlock": {
        "display": "block"
    },
    "photo": {
        "height": "auto",
        "width": 300
    },
    "video": {
        "height": "auto",
        "width": 300
    },
    "postContents": {
        "width": 300
    },
    "footer": {
        "marginTop": 20,
        "marginRight": 20,
        "marginBottom": 20,
        "marginLeft": 20,
        "textAlign": "center"
    },
    "col-centered": {
        "display": "inline-block",
        "float": "none",
        "textAlign": "left",
        "marginRight": -4
    },
    "adjust": {
        "marginBottom": 8
    }
});