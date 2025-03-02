import './module_require_resolution'

import type ssh from 'ssh2'

import type { parameters_inferface } from '@/types'

import fs from 'fs/promises'

import { parameters_get, print_usage, private_key_parse } from '@/functions'

async function main(): Promise<void> {
  const parameters: parameters_inferface = await parameters_get()

  if (process.argv.length === 2) {
    print_usage()
    process.exit(0)
  }

  if (
    parameters.message_to_sign === '' ||
    typeof parameters.message_to_sign === 'undefined'
  ) {
    process.stderr.write('message_to_sign: missing\n')
    print_usage(true)
    process.exit(1)
  }

  if (
    parameters.private_key_path === '' ||
    typeof parameters.private_key_path === 'undefined'
  ) {
    process.stderr.write('private_key_path: missing\n')
    print_usage(true)
    process.exit(1)
  }

  const private_key_string: string = await fs.readFile(
    parameters.private_key_path,
    {
      encoding: 'utf8',
      flag: 'r',
    },
  )

  const private_key: ssh.ParsedKey = await private_key_parse({
    private_key_string,
    private_key_passphrase: parameters.private_key_passphrase,
  })

  const signedBuffer: Buffer = private_key.sign(parameters.message_to_sign)

  process.stdout.write(`base64: ${signedBuffer.toString('base64')}\n`)
  process.stdout.write(`hex: ${signedBuffer.toString('hex')}\n`)
}

main()
