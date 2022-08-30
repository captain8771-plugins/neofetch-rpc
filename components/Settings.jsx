const { React, getModule } = require("powercord/webpack")
const { settings: { TextInput, Category, SelectInput }, Divider, FormNotice } = require("powercord/components")


module.exports = class Settings extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            revealdbg: false,
            adv: false,
            main: false
        }
    }

    render() {
        const { getSetting, updateSetting, toggleSetting, neofetch, reloadRPC } = this.props

        return (
            <div>
                <Category
                    name="Main"
                    description="general behaviour of the plugin"
                    opened={this.state.main}
                    onChange={() => this.setState({main: !this.state.main})}
                    >
                <SelectInput
                    options={neofetch(true).map(stuff => ({
                        label: stuff[0],
                        value: stuff[0]
                    }))}
                    onChange={({ value }) => {
                        updateSetting("displayed_keys1", value)
                        reloadRPC()
                    }}
                    value={getSetting("displayed_keys1", null)}
                    searchable={true}
                    required={true}
                    >
                    Displayed item 1
                </SelectInput>

                    <SelectInput
                        options={[{name: "None", value: "none"}, ...neofetch(true)].map(stuff => ({
                            label: stuff[0],
                            value: stuff[0]
                        }))}
                        onChange={({ value }) => {
                            updateSetting("displayed_keys2", value)
                            reloadRPC()
                        }}
                        value={getSetting("displayed_keys2", null)}
                        searchable={true}
                        required={false}
                    >
                        Displayed item 2
                    </SelectInput>

                </Category>


                <Category
                    name="Advanced"
                    description="stuff that could cause the plugin to break"
                    opened={this.state.adv}
                    onChange={() => this.setState({ adv: !this.state.adv })}
                    >
                    <TextInput
                        defaultValue={getSetting("command", "neofetch")}
                        required={false}
                        disabled={false}
                        onChange={val => {updateSetting("command", val);reloadRPC()}}
                        note="The command should implement a '--stdout' flag and should separate keys from values with ': '"
                    >
                        Command to run
                    </TextInput>
                </Category>


                <Category
                    name="Debug"
                    description="Includes everything the plugin can get out of neofetch"
                    opened={this.state.revealdbg}
                    onChange={() => this.setState({ revealdbg: !this.state.revealdbg })}
                    >
                    <FormNotice
                        type={FormNotice.Types.PRIMARY}
                        body={<div className={'debug-info'}>
                            <code>
                                <b>{getSetting("command", "neofetch")}</b>
                                <div className="row">
                                    { neofetch(true).map((key, index) => <div key={index} className="column">{key[0]} => {key[1]}</div> )}
                                </div>
                            </code>
                        </div>}
                        />
                </Category>

            </div>
        )
    }
}