// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LPToken is ERC20 {
    constructor() ERC20("Uniswap LP Token", "UNI-LP") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        _burn(from, amount);
    }
}

contract UniswapPool is ReentrancyGuard {
    IERC20 public immutable tokenA;
    IERC20 public immutable tokenB;
    LPToken public immutable lpToken;

    uint256 public reserveA;
    uint256 public reserveB;

    event LiquidityAdded(address indexed user, uint256 amountA, uint256 amountB, uint256 lpMinted);
    event LiquidityRemoved(address indexed user, uint256 amountA, uint256 amountB, uint256 lpBurned);
    event Swapped(address indexed user, address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut);

    constructor(address _tokenA, address _tokenB) {
        require(_tokenA != _tokenB, "Tokens must differ");
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        lpToken = new LPToken();
    }

    function _updateReserves() private {
        reserveA = tokenA.balanceOf(address(this));
        reserveB = tokenB.balanceOf(address(this));
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external nonReentrant returns (uint256 lpAmount) {
        require(amountA > 0 && amountB > 0, "Invalid amounts");

        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        if (lpToken.totalSupply() == 0) {
            lpAmount = sqrt(amountA * amountB);
        } else {
            lpAmount = min(
                (amountA * lpToken.totalSupply()) / reserveA,
                (amountB * lpToken.totalSupply()) / reserveB
            );
        }

        require(lpAmount > 0, "LP amount = 0");
        lpToken.mint(msg.sender, lpAmount);
        _updateReserves();

        emit LiquidityAdded(msg.sender, amountA, amountB, lpAmount);
    }

    function removeLiquidity(uint256 lpAmount) external nonReentrant {
        require(lpAmount > 0, "Invalid LP amount");

        uint256 totalSupply = lpToken.totalSupply();
        uint256 amountA = (lpAmount * reserveA) / totalSupply;
        uint256 amountB = (lpAmount * reserveB) / totalSupply;

        lpToken.burn(msg.sender, lpAmount);
        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);

        _updateReserves();
        emit LiquidityRemoved(msg.sender, amountA, amountB, lpAmount);
    }

    function swap(address tokenIn, uint256 amountIn) external nonReentrant returns (uint256 amountOut) {
        require(tokenIn == address(tokenA) || tokenIn == address(tokenB), "Invalid token");

        bool isAtoB = tokenIn == address(tokenA);
        IERC20 inToken = isAtoB ? tokenA : tokenB;
        IERC20 outToken = isAtoB ? tokenB : tokenA;
        uint256 reserveIn = isAtoB ? reserveA : reserveB;
        uint256 reserveOut = isAtoB ? reserveB : reserveA;

        require(amountIn > 0 && reserveIn > 0 && reserveOut > 0, "Invalid reserves");

        inToken.transferFrom(msg.sender, address(this), amountIn);

        uint256 amountInWithFee = amountIn * 997;
        amountOut = (amountInWithFee * reserveOut) / (reserveIn * 1000 + amountInWithFee);

        require(amountOut > 0, "Insufficient output amount");
        outToken.transfer(msg.sender, amountOut);

        _updateReserves();
        emit Swapped(msg.sender, tokenIn, amountIn, address(outToken), amountOut);
    }

    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}
