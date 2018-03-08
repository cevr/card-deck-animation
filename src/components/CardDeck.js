import React, { Component } from 'react';
import {
    View,
    Animated,
    PanResponder,
    Dimensions,
    StyleSheet,
    LayoutAnimation,
    UIManager
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.5 * SCREEN_WIDTH;
const VELOCITY_THRESHOLD = 2;
const FORCE_SWIPE_DURATION = 250;
const INPUT_RANGE_RATIO = 1.5;

class CardDeck extends Component {
    static defaultProps = {
        onSwipeRight: () => {},
        onSwipeLeft: () => {},
        data: [],
        renderCard: () => {},
        stopRenderCard: () => {}
    };

    constructor(props) {
        super(props);

        const position = new Animated.ValueXY();

        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x: gesture.dx, y: 0 });
            },
            onPanResponderRelease: (event, gesture) => {
                if (
                    gesture.dx > SWIPE_THRESHOLD ||
                    gesture.vx > VELOCITY_THRESHOLD
                ) {
                    this.forceSwipe('right');
                } else if (
                    gesture.dx < -SWIPE_THRESHOLD ||
                    gesture.vx < -VELOCITY_THRESHOLD
                ) {
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                }
            }
        });
        this.panResponder = panResponder;
        this.position = position;
    }

    state = {
        renderCardIndex: 0
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({ index: 0 });
        }
    }

    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental &&
            UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.easeInEaseOut();
    }

    forceSwipe = direction => {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        const y = 0;

        Animated.timing(this.position, {
            toValue: { x, y },
            duration: FORCE_SWIPE_DURATION
        }).start(() => this.onSwipeComplete(direction));
    };

    onSwipeComplete = direction => {
        const { onSwipeLeft, onSwipeRight, data } = this.props;
        const item = data[this.state.index];
        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
        this.position.setValue({ x: 0, y: 0 });
        this.setState({ renderCardIndex: this.state.renderCardIndex + 1 });
    };

    resetPosition = () => {
        Animated.spring(this.position, {
            toValue: { x: 0, y: 0 }
        }).start();
    };

    getCardStyle = () => {
        const rotate = this.position.x.interpolate({
            inputRange: [
                -SCREEN_WIDTH * INPUT_RANGE_RATIO,
                0,
                SCREEN_WIDTH * INPUT_RANGE_RATIO
            ],
            outputRange: ['-120deg', '0deg', '120deg']
        });
        return {
            ...this.position.getLayout(),
            transform: [{ rotate }]
        };
    };

    renderCards = () => {
        return this.state.renderCardIndex >= this.props.data.length
            ? this.props.stopRenderCard()
            : this.props.data
                  .map((item, currentCardIndex) => {
                      if (currentCardIndex < this.state.renderCardIndex) {
                          return null;
                      }
                      if (currentCardIndex === this.state.renderCardIndex) {
                          return (
                              <Animated.View
                                  key={item.id}
                                  style={[
                                      this.getCardStyle(),
                                      styles.primaryCardStyle
                                  ]}
                                  {...this.panResponder.panHandlers}
                              >
                                  {this.props.renderCard(item)}
                              </Animated.View>
                          );
                      }
                      return (
                          <Animated.View
                              key={item.id}
                              style={[
                                  styles.cardStyle,
                                  {
                                      top:
                                          10 *
                                          (currentCardIndex -
                                              this.state.renderCardIndex)
                                  }
                              ]}
                          >
                              {this.props.renderCard(item)}
                          </Animated.View>
                      );
                  })
                  .reverse();
    };

    render() {
        return <View>{this.renderCards()}</View>;
    }
}

const styles = StyleSheet.create({
    primaryCardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH,
        zIndex: 1
    },
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH,
        zIndex: 0
    }
});
export default CardDeck;
