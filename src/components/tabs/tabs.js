import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import './tabs.css';
import { bindKeyboard } from 'react-swipeable-views-utils';

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

class DemoTabs extends React.Component {
    state = {
        index: 0,
    };

    handleChange = (event, value) => {
        this.setState({
            index: value,
        });
    };

    handleChangeIndex = index => {
        this.setState({
            index,
        });
    };

    render() {
        const { index } = this.state;

        return (
            <div className='tabs'>
                <Tabs value={index} onChange={this.handleChange}>
                    <Tab label="Avaks" />
                    <Tab label="Transactions" />
                    <Tab label="Javaks" />
                    <Tab label="Status" />
                </Tabs>
                <BindKeyboardSwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>
                    {this.props.children}
                </BindKeyboardSwipeableViews>
            </div>
        );
    }
}

export default DemoTabs;
