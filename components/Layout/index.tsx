import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'
import Footer from './Footer'
import Header from './Header'

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <Box>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <Header />
        {children}
        <Footer />
      </Box>
    </Box>
  )
}
