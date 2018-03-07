import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

class CardDeck extends Component {
    constructor(props) {
        super(props);

        const position = new Animated.ValueXY();

        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                console.log(gesture);
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderRelease: () => {
                this.resetPosition();
            }
        });
        this.panResponder = panResponder;
        this.position = position;
    }

    resetPosition = () => {
        Animated.spring(this.position, {
            toValue: { x: 0, y: 0 }
        }).start();
    };

    getCardStyle = () => {
        const rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg']
        });
        return {
            ...this.position.getLayout(),
            transform: [{ rotate }]
        };
    };

    renderCards = () => {
        return this.props.data.map((item, index) => {
            if (index === 0) {
                return (
                    <Animated.View
                        key={item.id}
                        style={this.getCardStyle()}
                        {...this.panResponder.panHandlers}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }
            return this.props.renderCard(item);
        });
    };
    render() {
        return <View>{this.renderCards()}</View>;
    }
}

export default CardDeck;