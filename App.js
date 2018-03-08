//module import
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Button } from 'react-native-elements';

//relative imports
import CardDeck from './src/components/CardDeck';

//placeholder
import { DATA } from './src/api/cardData';

export default class App extends React.Component {
    renderCard = (data, index) => {
        return (
            <Card key={data.id} title={data.text} image={{ uri: data.uri }}>
                <Text style={{ marginTop: 10 }}>I can customize the card</Text>
                <Button
                    icon={{ name: 'code' }}
                    title="View now!"
                    backgroundColor="#03A9F4"
                />
            </Card>
        );
    };

    stopRenderCard = () => {
        return <Text>There's no more content here!</Text>;
    };
    render() {
        return (
            <View style={styles.container}>
                <CardDeck
                    data={DATA}
                    stopRenderCard={this.stopRenderCard}
                    renderCard={this.renderCard}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 30
    }
});
