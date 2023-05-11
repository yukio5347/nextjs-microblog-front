import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from '@/utils/MicroBlog.json';
import { Spin } from '@/components/Spin';

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider;
  }
}

export default function Home() {
  const [wallet, setWallet] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [processing, setProcessing] = useState(false);
  const contractAddress = '0x8C46eBD501CBe0b87428f0b9aD50d53353bF08bC';

  interface Post {
    author: string;
    content: string;
    timestamp: number;
  }

  const showAddress = (address: string) => {
    return (
      <div className='flex'>
        <span className='truncate inline-block'>{address.slice(0, -10)}</span>
        {address.slice(-10)}
      </div>
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toISOString().slice(0, 16).replace('T', ' ');
  };

  const getContract = (ethereum: ethers.providers.ExternalProvider, withSigner = false) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi.abi, withSigner ? signer : provider);
    return contract;
  };

  const getAllPosts = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const contract = getContract(ethereum);
        const data = await contract.getPosts();
        setPosts(data);
      }
    } catch (error) {
      console.log('getAllPosts error: ', error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const accounts = ethereum.request && (await ethereum.request({ method: 'eth_accounts' }));
        if (accounts.length !== 0) {
          const account = accounts[0];
          setWallet(account);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    setProcessing(true);
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }
      const accounts =
        ethereum.request &&
        (await ethereum.request({
          method: 'eth_requestAccounts',
        }));
      setWallet(accounts[0]);
    } catch (error) {
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const contract = getContract(ethereum, true);
        const transaction = await contract.store(content);
        await transaction.wait();
        setContent('');
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllPosts();

    let contract: any;
    const onNewPost = (author: string, content: string, timestamp: number) => {
      setPosts((prevState) => [
        ...prevState,
        {
          author: author,
          content: content,
          timestamp: timestamp,
        },
      ]);
    };

    if (window.ethereum) {
      contract = getContract(window.ethereum, true);
      contract.on('NewPost', onNewPost);
    }

    return () => {
      if (contract) {
        contract.off('NewPost', onNewPost);
      }
    };
  }, []);

  return (
    <div className='py-5'>
      <div className='container text-center'>
        <h1 className='mb-5 text-xl font-semibold'>Onchain Micro Blog</h1>
        {wallet ? (
          <form onSubmit={handleSubmit}>
            <textarea
              id='content'
              name='content'
              value={content}
              placeholder='Write your new post content'
              onChange={(e) => setContent(e.target.value)}
              className='block mb-5 p-2.5 w-full rounded-xl border focus:ring-sky-500 focus:border-sky-500'
              required
            />
            <button className='mb-5 px-6 w-40 h-12 text-white bg-sky-500 rounded-full'>
              {processing ? <Spin /> : 'New Post'}
            </button>
          </form>
        ) : (
          <button className='mb-5 px-6 w-40 h-12 text-white bg-sky-500 rounded-full' onClick={connectWallet}>
            {processing ? <Spin /> : 'Connect Wallet'}
          </button>
        )}
      </div>
      {posts && (
        <div className='sm:container'>
          {posts
            .slice()
            .reverse()
            .map((post, index) => {
              return (
                <div
                  key={index}
                  className='border-t sm:border-x sm:first:rounded-t-xl sm:last:rounded-b-xl last:border-b'
                >
                  <div className='container py-4'>
                    <div className='text-sm font-semibold mb-2'>{showAddress(post.author)}</div>
                    <div className='mb-2'>{post.content}</div>
                    <div className='text-xs text-gray-400 text-right'>{formatDate(post.timestamp)}</div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
