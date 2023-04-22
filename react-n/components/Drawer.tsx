import React, { Component } from "react";
import {
  View,
  Dimensions,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";

type DrawerProps = {
  primaryColor: string;
  secondaryColor: string;
  cancelColor: string;
  marginLeft: number;
  marginTop: number;

  openStart?: () => void;
  openEnd?: () => void;
  closeStart?: () => void;
  closeEnd?: () => void;

  sideMenu?: React.ReactElement;
  topRightView?: React.ReactElement;
};
type DrawerState = {
  width: number;
  height: number;
  status: "close" | "transition" | "open";
};

export default class Drawer extends Component<DrawerProps, DrawerState> {
  static defaultProps = {
    marginLeft: 0,
    marginTop: 0,
    primaryColor: "#731ED2",
    secondaryColor: "#9646EC",
    cancelColor: "#731ED2",
  };

  private readonly defaultTopRightView: number;
  private readonly scaleInner: Animated.Value;
  private readonly scaleOuter: Animated.Value;
  private readonly closeTop: Animated.Value;
  private readonly opacity: Animated.Value;
  private readonly sideMenuTop: Animated.Value;
  private readonly topRightView: Animated.Value;

  constructor(props: DrawerProps) {
    super(props);

    const { width, height } = { ...Dimensions.get("window") };

    this.defaultTopRightView = -width;

    this.scaleInner = new Animated.Value(0.01);
    this.scaleOuter = new Animated.Value(0.01);
    this.closeTop = new Animated.Value(100);
    this.opacity = new Animated.Value(0.3);
    this.sideMenuTop = new Animated.Value(-500);
    this.topRightView = new Animated.Value(this.defaultTopRightView);

    this.state = {
      width,
      height,
      status: "close",
    };
  }

  open = () => {
    const {
      scaleInner,
      scaleOuter,
      closeTop,
      opacity,
      sideMenuTop,
      topRightView,
      defaultTopRightView,
    } = { ...this };
    this.setState({ status: "transition" }, () => {
      this.props.openStart?.();
      Animated.parallel([
        Animated.timing(scaleOuter, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.quad),
		  useNativeDriver: true,
        }),
        Animated.timing(scaleInner, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.quad),
		  useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(sideMenuTop, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(closeTop, {
          toValue: 0,
          duration: 350,
          easing: Easing.cubic,
          useNativeDriver: false,
        }),
        Animated.timing(topRightView, {
          toValue: defaultTopRightView + 150,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start(() => {
        this.props.openEnd?.();
        this.setState({ status: "open" });
      });
    });
  };

  close = () => {
    const {
      scaleInner,
      scaleOuter,
      closeTop,
      opacity,
      sideMenuTop,
      topRightView,
      defaultTopRightView,
    } = { ...this };

    this.setState({ status: "transition" }, () => {
      this.props.closeStart?.();

      Animated.parallel([
        Animated.timing(scaleOuter, {
          toValue: 0.01,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(scaleInner, {
          toValue: 0.01,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(sideMenuTop, {
          toValue: -500,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(closeTop, {
          toValue: 100,
          duration: 350,
          easing: Easing.cubic,
          useNativeDriver: false,
        }),
        Animated.timing(topRightView, {
          toValue: defaultTopRightView,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start(() => {
        this.props.closeEnd?.();
        this.setState({ status: "close" });
      });
    });
  };

  renderDrawer() {
    const { primaryColor, secondaryColor, cancelColor, marginLeft, marginTop } =
      { ...this.props };
    const {
      scaleInner,
      scaleOuter,
      opacity,
      closeTop,
      sideMenuTop,
      topRightView,
    } = { ...this };
    const { status, width, height } = { ...this.state };

    const mL = marginLeft; // marginLeft of the middle of the circle
    const mT = marginTop; // marginTop  of the middle of the circle

    const cDiam = width + height - (mL + mT); // circle diameter
    const right = cDiam / 2 - mL;
    const top = -cDiam / 2 + mT;

    if (status === "close") return undefined;

    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 999,
        }}
      >
        <View style={{ width: "100%", height: "100%", position: "absolute" }}>
          <Animated.View
            style={{
              opacity: opacity,
              transform: [{ scale: scaleOuter }],
              width: cDiam,
              height: cDiam,
              right: right,
              top: top,
              borderRadius: height * 2,
              backgroundColor: secondaryColor,
            }}
          ></Animated.View>
        </View>

        <View style={{ width: "100%", height: "100%", position: "absolute" }}>
          <Animated.View
            style={{
              opacity: opacity,
              transform: [{ scale: scaleInner }],
              width: cDiam - 175,
              height: cDiam,
              right: right - 175 / 2,
              top: top,
              borderRadius: height * 2,
              backgroundColor: primaryColor,
            }}
          ></Animated.View>
        </View>

        {/*CANCEL BOTTON*/}
        <View
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Animated.View
            style={{
              top: closeTop,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 25,
              width: 50,
              height: 50,
              borderRadius: 50,
              backgroundColor: cancelColor,
              elevation: 2,
            }}
          >
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={this.close}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    transform: [{ rotateZ: "45deg" }],
                    width: 30,
                    height: 5,
                    borderRadius: 30,
                    top: 4,
                    backgroundColor: "white",
                  }}
                ></View>
                <View
                  style={{
                    transform: [{ rotateZ: "-45deg" }],
                    width: 30,
                    height: 5,
                    borderRadius: 30,
                    bottom: 1,
                    backgroundColor: "white",
                  }}
                ></View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={{ width: "100%", height: "100%", position: "absolute" }}>
          <Animated.View
            style={{ width: 150, height: 80, right: topRightView, top: 0 }}
          >
            {this.props.topRightView}
          </Animated.View>
        </View>

        <View style={{ width: "100%", height: "100%", position: "absolute" }}>
          <Animated.View
            style={{
              width: cDiam / 3.7,
              height: cDiam / 2.6,
              paddingTop: 30,
              paddingLeft: 30,
              top: sideMenuTop,
            }}
          >
            <View style={{ width: "100%", height: "100%" }}>
              {this.props.sideMenu}
            </View>
          </Animated.View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
        <View style={{ flex: 1, width: "100%", height: "100%", zIndex: 0 }}>
          {this.props.children}
        </View>
        {this.renderDrawer()}
      </View>
    );
  }
}
