import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { formatEther } from 'ethers/lib/utils'
import { ethers, run } from 'hardhat'
import { getAddresses } from '../utils/addressManager'

async function main () {
  /*============================================================================*/
  const signers: SignerWithAddress[] = await ethers.getSigners()

  let balanceBeforeDeploy = await signers[0].getBalance()
  const adminAddress = await signers[0].getAddress()
  const addresses = await getAddresses(ethers.provider.network.chainId)

  /*============================================================================*/
  try {
    await run('verify:verify', {
      address: addresses['DEPLOYED_ANIMAL_TOKEN_ERC20'],
      constructorArguments: [],
      contract: 'contracts/tokens/Animal.sol:Animal'
    })
  } catch (err) {
    console.log(err)
  }

  /*============================================================================*/
  try {
    await run('verify:verify', {
      address: addresses['DEPLOYED_ANIMAL_TOKEN_ERC20'],
      constructorArguments: [],
      contract: 'contracts/tokens/Anime.sol:Anime'
    })
  } catch (err) {
    console.log(err)
  }

  /*============================================================================*/
  const nameBorrowerNode = process.env.NAME_BORROWER_NODE!
  const symbolBorrowerNode = process.env.SYMBOL_BORROWER_NODE!
  const nameLenderNode = process.env.NAME_LENDER_NODE!
  const symbolLenderNode = process.env.SYMBOL_LENDER_NODE!
  const baseUrl = process.env.BASE_URL!

  /*============================================================================*/
  try {
    await run('verify:verify', {
      address: addresses['DEPLOYED_LENDER_NODE_CONTRACT_ADDRESS'],
      constructorArguments: [
        adminAddress,
        nameLenderNode,
        symbolLenderNode,
        baseUrl
      ],
      contract: 'contracts/Xy3Nft.sol:Xy3Nft'
    })
  } catch (err) {
    console.log(err)
  }

  /*============================================================================*/
  try {
    await run('verify:verify', {
      address: addresses['DEPLOYED_BORROWER_NODE_CONTRACT_ADDRESS'],
      constructorArguments: [
        adminAddress,
        nameBorrowerNode,
        symbolBorrowerNode,
        baseUrl
      ],
      contract: 'contracts/Xy3Nft.sol:Xy3Nft'
    })
  } catch (err) {
    console.log(err)
  }

  /*============================================================================*/
  try {
    await run('verify:verify', {
      address: addresses['DEPLOYED_DELEGATE_CONTRACT_ADDRESS'],
      constructorArguments: [
        adminAddress,
      ],
      contract: 'contracts/Delegate.sol:Delegate'
    })
  } catch (err) {
    console.log(err)
  }

  /*============================================================================*/
  try {
    await run('verify:verify', {
      address: addresses['DEPLOYED_SERVICE_FEE_CONTRACT_ADDRESS'],
      constructorArguments: [
        adminAddress,
      ],
      contract: 'contracts/ServiceFee.sol:ServiceFee'
    })
  } catch (err) {
    console.log(err)
  }

  /*============================================================================*/
  try {
    await run('verify:verify', {
      address: addresses['DEPLOYED_PROVIDER_CONTRACT_ADDRESS'],
      constructorArguments: [
        adminAddress,
      ],
      contract: 'contracts/AddressProvider.sol:AddressProvider'
    })
  } catch (err) {
    console.log(err)
  }

  /*============================================================================*/
  try {
    await run('verify:verify', {
      address: addresses['DEPLOYED_SIGNATURE_UTILS_CONTRACT_ADDRESS'],
      constructorArguments: [],
      contract: 'contracts/utils/SigningUtils.sol:SigningUtils'
    })
  } catch (err) {
    console.log(err)
  }

  /*============================================================================*/
  try {
    await run('verify:verify', {
      address: addresses['DEPLOYED_XY3_LOGIC_CONTRACT_ADDRESS'],
      constructorArguments: [],
      contract: 'contracts/XY3.sol:XY3'
    })
  } catch (err) {
    console.log(err)
  }

  try {
    await run('verify:verify', {
      address: addresses['DEPLOYED_XY3_PROXY_LOGIC_CONTRACT_ADDRESS'],
      constructorArguments: [
        addresses['DEPLOYED_XY3_LOGIC_CONTRACT_ADDRESS'],
        addresses['DEPLOYED_PROXY_ADMIN_CONTRACT_ADDRESS'],
        []
      ],
      contract: 'contracts/XY3Proxy.sol:XY3Proxy'
    })
  } catch (err) {
    console.log(err)
  }
  
  console.log(
    `============================💕💕💓💓Finished verify whole contract💕💕💓💓=============================`
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
