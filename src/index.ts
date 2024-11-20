// import { timingSafeEqual } from 'crypto'
import fs from 'fs/promises'
import * as ssh from 'ssh2'

function printUsage(): void {
  console.log('Usage:')
  console.log('\tibby-web-signer privateKey.pk "Message to sign"')
  console.log('\t\t- OR -')
  console.log(
    '\tibby-web-signer privateKey.pk "PRIVATE_KEY_PASSPHRASE" "Message to sign"',
  )
}

async function main(): Promise<void> {
  const inputFileLocation: string | undefined = process.argv[2]

  if (inputFileLocation === '' || typeof inputFileLocation === 'undefined') {
    console.error('Missing input file location')
    printUsage()
    process.exit(1)
  }

  const hasPassphrase: boolean = process.argv.length === 5

  const messageToSign: string | undefined = process.argv[hasPassphrase ? 4 : 3]

  if (messageToSign === '' || typeof messageToSign === 'undefined') {
    console.error('Missing message to sign')
    printUsage()
    process.exit(1)
  }

  const inputFile: string = await fs.readFile(inputFileLocation, {
    encoding: 'ascii',
  })

  const keyPass: string | undefined = hasPassphrase
    ? process.argv[3]
    : undefined

  const privKey: ssh.ParsedKey | Error = ssh.utils.parseKey(inputFile, keyPass)

  if (privKey instanceof Error) {
    console.error('Unable to parse private key')
    printUsage()
    process.exit(1)
  }

  const signedBuffer: Buffer = privKey.sign(messageToSign)

  console.log('Base64')
  console.log(signedBuffer.toString('base64'))
  console.log('Hex')
  console.log(signedBuffer.toString('hex'))
}

main()
