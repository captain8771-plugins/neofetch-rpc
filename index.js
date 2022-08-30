// shoutout to E-boi because i have no idea what i am doing
const { Plugin } = require('powercord/entities')
const { getModule, React } = require('powercord/webpack')
const { exec } = require('child_process')
const { matchNeofetchValues } = require("./util")

const Settings = require("./components/Settings.jsx")

const { SET_ACTIVITY } = getModule(['SET_ACTIVITY'], false)
const { getAssets } = getModule(['getAssets'], false);


module.exports = class NeofetchRPC extends Plugin {
    startPlugin() {
        this._output = ""
        // this.settings.set("setup", false) // TODO: remember to remove
        this.log(this.settings.get("displayed_keys1"))
        if (!this.settings.get("setup", false)) {
            this.settings.set("displayed_keys1", null)
            this.settings.set("displayed_keys2", null)
            this.settings.set("rpc-name", "Neofetch")
            this.settings.set("command", "neofetch")
            this.settings.set("setup", true)
            this.settings.set("img", [])
            this.settings.set("app_id", "972908263769247865")  // if you want to use a custom app_id, set this one
        }

        powercord.api.settings.registerSettings(this.entityID, {
            category: this.entityID,
            label: "Neofetch-RPC",
            render: props =>
                React.createElement(Settings, {
                    neofetch: this.neofetch.bind(this), // so we can access the neofetch function
                    reloadRPC: this.rpc.bind(this),
                    ...props
                })
        })

        setTimeout(this.rpc.bind(this), 2000)
        setTimeout(this.rpc.bind(this), 5000)


    }

    getImages() {
        // yoink
        // https://github.com/E-boi/custom-rpc/blob/master/Settings.jsx#L33-L42
        getAssets(this.settings.get("app_id"))
            .then(assets => {
                const array = Object.values(assets).filter(asset => asset.type === 1);
                array.unshift({ name: 'None' });
                const arr = array.map(obj => obj.name)
                this.settings.set("img", arr)
            })
            .catch(() => this.settings.set("img", []));
    }

    image() {
        this.getImages()
        const os = this.get_prop("OS").replace(/ /g, "")
        for (const o of this.settings.get("img")) {
            if (os.toLowerCase().includes(o)) {
                return o
            }
        }
        return ""
    }

    get_prop(key) {
        if (key === null || key === undefined) {
            return undefined
        }
        const nf = this.neofetch()
        const a = nf.filter((obj) => obj.name === key)[0]
        return a !== undefined ? `${a.name}: ${a.value}` : `${key}: undefined`
    }

    neofetch(arr) {
        let output
        try {
            exec(`${this.settings.get("command", "neofetch")} --stdout`, (e, out, err) => {this._output = out})
            output = this._output
        } catch (e) {
            output = ""
        }

        let ret = matchNeofetchValues(output)
        if (arr) {
            ret = ret.map(Object.values)
        }
        return ret
    }

    setRpc(values, enable) {
        SET_ACTIVITY.handler({
            isSocketConnected: () => true,
            socket: {
                id: 69420,
                application: {
                    id: this.settings.get("app_id"),
                    name: this.settings.get("rpc-name")
                },
                transport: "ipc"
            },
            args: {
                pid: 10,
                activity: enable ? {
                    details: this.get_prop(this.settings.get("displayed_keys1")),
                    state: this.get_prop(this.settings.get("displayed_keys2")),
                    timestamps: undefined,
                    assets: {
                        large_image: this.image(),
                        small_image: "",
                        large_text: this.get_prop("OS"),
                        small_text: undefined
                    }
                } : undefined
            }
        })
    }

    rpc(enable=true) {
        const nf = this.neofetch()
        this.setRpc(nf, enable)
    }

    pluginWillUnload() {
        powercord.api.settings.unregisterSettings(this.entityID)
        this.rpc(false)
    }


}
