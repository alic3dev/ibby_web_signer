export function print_usage(error: boolean = false): void {
  const output_stream: NodeJS.WritableStream = error
    ? process.stderr
    : process.stdout

  output_stream.write('Usage:\n')
  output_stream.write('\tibby-web-signer privateKey.pk "Message to sign"\n')
  output_stream.write('\t\t- OR -\n')
  output_stream.write(
    '\tibby-web-signer privateKey.pk "PRIVATE_KEY_PASSPHRASE" "Message to sign"\n',
  )
}
