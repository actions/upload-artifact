import {
  CommitmentPolicy,
  KmsKeyringNode,
  buildEncrypt
} from '@aws-crypto/client-node'
import {readFileSync, writeFileSync} from 'fs'

export async function encryptFile(
  filePath: string,
  kmsKeyId: string
): Promise<void> {
  const keyring = new KmsKeyringNode({generatorKeyId: kmsKeyId})

  const client = buildEncrypt(CommitmentPolicy.REQUIRE_ENCRYPT_ALLOW_DECRYPT)
  // Read the file content
  const fileBuffer = readFileSync(filePath)

  try {
    // Encrypt the data
    const {result} = await client.encrypt(keyring, fileBuffer)

    // Overwrite file with encrypted data
    writeFileSync(filePath, result)
    console.log('File encrypted successfully')
  } catch (error) {
    console.error('Error encrypting file:', error)
    throw error
  }
}
