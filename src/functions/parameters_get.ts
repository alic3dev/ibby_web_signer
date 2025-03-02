import type { enviroment_interface, parameters_inferface } from '@/types'

import fs from 'node:fs/promises'

export async function parameters_get(): Promise<parameters_inferface> {
  const parameters: parameters_inferface = {
    private_key_path: '',
    private_key_passphrase: '',
    message_to_sign: '',
  }

  if (process.argv.length === 3) {
    const enviroment_string: string = await fs.readFile('.env', {
      encoding: 'utf8',
      flag: 'r',
    })

    const enviroment: enviroment_interface = enviroment_string
      .split('\n')
      .reduce<enviroment_interface>(
        (
          enviroment: enviroment_interface,
          key_value_pair: string,
        ): enviroment_interface => {
          const key_value_pair_split: string[] = key_value_pair.split('=')

          return {
            ...enviroment,
            [key_value_pair_split[0] ?? '']: key_value_pair_split
              .slice(1)
              .join(''),
          }
        },
        {},
      )

    parameters.private_key_path = enviroment.KEY_PK ?? ''
    parameters.private_key_passphrase = enviroment.KEY_PW
    parameters.message_to_sign = process.argv[2]
  } else {
    const passphrase_has: boolean = process.argv.length === 5

    parameters.private_key_path = process.argv[2]
    parameters.private_key_passphrase = passphrase_has
      ? process.argv[3]
      : undefined
    parameters.message_to_sign = process.argv[passphrase_has ? 4 : 3]
  }

  return parameters
}
