import type { private_key_parse_parameters_inferface } from '@/types'

import fs from 'node:fs/promises'
import * as ssh from 'ssh2'

export async function private_key_parse(
  parameters: private_key_parse_parameters_inferface,
): Promise<ssh.ParsedKey> {
  let private_key = ssh.utils.parseKey(
    parameters.private_key_string,
    parameters.private_key_passphrase,
  )

  if (private_key instanceof Error) {
    if (parameters.private_key_passphrase) {
      parameters.private_key_passphrase = await fs.readFile(
        parameters.private_key_passphrase,
        {
          encoding: 'utf8',
        },
      )

      parameters.private_key_passphrase =
        parameters.private_key_passphrase.trim()

      private_key = ssh.utils.parseKey(
        parameters.private_key_string,
        parameters.private_key_passphrase,
      )
    }
  }

  if (private_key instanceof Error) {
    throw private_key
  }

  return private_key
}
