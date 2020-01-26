import https from 'https'

export interface DiscordMessage {
  content: string
  username?: string
  avatar_url?: string
  embeds?: any
}

/**
 * It's probably ridiculous to instantiate a class to call one method, once...
 * but I initially wrote this for some long-lived TypeScript services, so 🤷‍♂
 */
export class Discord {
  constructor(
    private channelID: string,
    private discordToken: string,
    private defaultMsg: DiscordMessage,
    private onError: (err: Error) => void = () => null,
    private onSuccess: (msg: string) => void = () => null
  ) {
    if (!discordToken || !channelID) {
      throw new Error('Discord config missing')
    }
  }

  public async postMessage(msg: DiscordMessage) {
    const data = JSON.stringify({
      ...this.defaultMsg,
      ...msg
    })
    const options = {
      method: 'POST',
      port: 443,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const url = `https://discordapp.com/api/webhooks/${this.channelID}/${this.discordToken}`
    // console.info('discord posting', url, options)
    const req = https.request(url, options, (res) => {
      if (res.statusCode <= 204) {
        this.onSuccess('Done!')
      } else {
        console.error(
          `Got status code from discord: ${res.statusCode}, message: ${res.statusMessage}`
        )
      }
    })
    req.on('error', (err) => {
      console.error('Had trouble posting webhook to discord :/', err)
      this.onError(err)
    })
    req.write(data)
    req.end()
  }
}
