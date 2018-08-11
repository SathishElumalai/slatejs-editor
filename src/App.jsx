import React from 'react';
import { Value } from 'slate';
import { Editor } from './editor';

import './App.css';

import { plugin as annotatePlugin, AnnotateToolbar } from './plugins/annotations';
import { plugin as markShortcutsPlugin } from './plugins/mark-shortcuts';
import { Toolbar, plugin as toolbarPlugin } from './plugins/toolbar';
import HistoryButtons from './plugins/history';
import tablePlugin, { TableToolbar } from './plugins/table';

const plugins = [markShortcutsPlugin(), toolbarPlugin(), annotatePlugin(), ...tablePlugin];

const existingValue = JSON.parse(localStorage.getItem('content'));
const initialValue = Value.fromJSON(
    existingValue || {
        document: {
            nodes: [
                {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [
                        {
                            object: 'text',
                            leaves: [
                                {
                                    text: 'A line of text in a paragraph',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: initialValue,
        };
    }

    onChange = ({ value }) => {
        const { value: stateValue } = this.state;
        if (value.document !== stateValue.document) {
            const content = JSON.stringify(value.toJSON());
            console.log(content);
            localStorage.setItem('content', content);
        }
        this.setState({
            value,
        });
    };

    render() {
        const { value } = this.state;
        return (
            <div className="App editor">
                <p className="App-intro">SlateJS Editor</p>
                <Toolbar
                    onChange={this.onChange}
                    value={value}
                    render={({ DefaultButtons }) => (
                        <React.Fragment>
                            <DefaultButtons />
                            <HistoryButtons value={value} onChange={this.onChange} />
                            <TableToolbar value={value} onChange={this.onChange} />
                            <AnnotateToolbar value={value} onChange={this.onChange} />
                        </React.Fragment>
                    )}
                />
                <Editor value={value} onChange={this.onChange} plugins={plugins} />
            </div>
        );
    }
}

export default App;
