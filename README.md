# 📚 Redis Cheat Sheet — Class Fullstack Thầy Tài

> Tổng hợp đầy đủ các lệnh Redis từ cơ bản đến nâng cao, kèm ví dụ thực tế.

---

## 📖 Mục Lục

- [0. Cluster](#0-cluster)
- [1. Kết Nối Redis](#1-connect-redis)
- [2. Global Commands](#2-global)
- [3. String](#3-string)
- [4. Hash](#4-hash)
- [5. List](#5-list)
- [6. Set](#6-set)
- [7. Sorted Set (ZSet)](#7-zset)
- [8. Pub/Sub](#8-redis-pubsub)
- [9. Bitmaps & Bitfields](#9-redis-bitmaps-and-bitfields)
- [10. Stream](#10-stream)
- [11. Load Test](#11-loadtest)
- [12. Cluster Node.js Info](#12-check-core-cluster-nodejs)

---

## 0. CLUSTER

Khởi tạo Redis Cluster với 6 nodes (3 master + 3 replica):

```bash
# Kết nối vào redis node với cluster mode
redis-cli -c -p 7002

# Tạo cluster từ bên trong container
docker exec -it redis-node-1 redis-cli --cluster create \
    redis-node-1:7001 \
    redis-node-2:7002 \
    redis-node-3:7003 \
    redis-node-4:7004 \
    redis-node-5:7005 \
    redis-node-6:7006 \
    --cluster-replicas 1
```

---

## 1. CONNECT REDIS

```bash
# Kết nối cơ bản
redis-cli -h <host> -p <port> -a <password>

# Ví dụ thực tế
redis-cli -h 127.0.0.1 -p 6379 -a mypassword

# Kết nối vào container Docker
docker exec -it <container_name> redis-cli
```

---

## 2. GLOBAL

```bash
# Tìm kiếm key theo pattern
KEYS 't*'           # Tất cả key bắt đầu bằng 't'
KEYS '*user*'       # Tất cả key chứa 'user'
KEYS '*'            # Tất cả key (KHÔNG dùng trên production!)

# Xem kiểu dữ liệu của key
TYPE <key>

# Xem TTL (thời gian còn lại - tính bằng giây)
TTL <key>           # -1: không có TTL, -2: key không tồn tại

# Đặt TTL cho key
EXPIRE <key> 3600   # Hết hạn sau 3600 giây (1 giờ)

# Xoá key
DEL <key>
UNLINK <key>        # Xoá bất đồng bộ (không block)

# Đổi tên key
RENAME <old_key> <new_key>

# Flush toàn bộ database (CẢNH BÁO!)
FLUSHDB             # Flush database hiện tại
FLUSHALL            # Flush tất cả databases
```

---

## 3. STRING

Kiểu dữ liệu cơ bản nhất của Redis. Có 3 dạng encoding nội bộ:
- `int`: lưu số nguyên
- `embstr`: chuỗi ≤ 44 bytes
- `raw`: chuỗi > 44 bytes

```bash
# --- SET / GET ---
SET name "Nguyen Tien Tai"
GET name

# SET với TTL
SET session_token "abc123xyz" EX 3600      # EX: giây
SET session_token "abc123xyz" PX 3600000   # PX: mili giây

# SET chỉ khi key CHƯA tồn tại (NX = Not eXists)
SET lock_key_unique unique_value NX PX 10000
TTL lock_key_unique

# SET chỉ khi key ĐÃ tồn tại (XX = eXists)
SET name "New Value" XX

# --- ENCODING CHECK ---
STRLEN name                                 # Độ dài chuỗi
OBJECT ENCODING name                        # Xem encoding type

# Embstring (<= 44 bytes)
SET str_embed "0123456789012345678901234567890123456789abc"

# Raw (> 44 bytes)
SET str_raw "0123456789012345678901234567890123456789abcXXXXXX"

# Int
SET counter 10
OBJECT ENCODING counter                     # => "int"

# --- COUNTER (Tăng/Giảm) ---
INCR   like:product-001                     # Tăng 1
INCRBY like:product-001 5                   # Tăng N
DECR   like:product-001                     # Giảm 1
DECRBY like:product-001 5                   # Giảm N

# --- EXISTS / DEL ---
EXISTS block_user_id                        # 1 = tồn tại, 0 = không
DEL    like:product-001

# --- MULTI SET/GET ---
MSET key1 "val1" key2 "val2" key3 "val3"
MGET key1 key2 key3
```

---

## 4. HASH

Lưu object dạng field-value, phù hợp cho dữ liệu người dùng, giỏ hàng, v.v.

```bash
# --- ADD ---
# Thêm single field
HSET cart:1 product1 2

# Thêm nhiều fields cùng lúc
HSET cart:1 product2 1  product3 3  product4 1

# --- GET ---
# Lấy toàn bộ key + value
HGETALL cart:1

# Lấy value của 1 field
HGET cart:1 product2

# Lấy nhiều fields
HMGET cart:1 product1 product2 product3

# Lấy tất cả keys
HKEYS cart:1

# Lấy tất cả values
HVALS cart:1

# --- CHECK ---
HEXISTS cart:1 product3             # 1 = tồn tại
HLEN    cart:1                      # Số lượng fields

# --- UPDATE (Counter) ---
HINCRBY cart:1 product1 2           # Tăng số lượng product1 lên 2

# --- DEL ---
HDEL cart:1 product2                # Xoá 1 field
DEL  cart:1                         # Xoá toàn bộ hash key

# --- SCAN (không block server) ---
HSCAN cart:1 0 COUNT 10
```

---

## 5. LIST

Danh sách có thứ tự, hỗ trợ thêm từ đầu (LPUSH) hoặc cuối (RPUSH). Phù hợp cho queue, lịch sử.

```bash
# --- ADD ---
LPUSH order_history:user-001 "order_id_1"       # Thêm vào đầu list
RPUSH order_history:user-001 "order_id_2"       # Thêm vào cuối list

# Thêm nhiều phần tử
LPUSH order_history:user-001 "order_id_3" "order_id_4"

# Chèn phần tử vào vị trí cụ thể
LINSERT order_history:user-001 BEFORE "order_id_1" "order_id_5"
LINSERT order_history:user-001 AFTER  "order_id_1" "order_id_6"

# --- GET ---
# Lấy toàn bộ (0 = đầu, -1 = cuối)
LRANGE order_history:user-001 0 -1

# Lấy phần tử theo index
LINDEX order_history:user-001 0

# Độ dài list
LLEN order_history:user-001

# --- POP ---
LPOP order_history:user-001         # Lấy & xoá phần tử đầu
RPOP order_history:user-001         # Lấy & xoá phần tử cuối

# Blocking POP (chờ đến khi có dữ liệu — dùng cho queue)
BLPOP order_history:user-001 0      # 0 = chờ vô hạn
BRPOP order_history:user-001 30     # Chờ tối đa 30 giây

# --- DEL ---
LREM order_history:user-001 0 "order_id_1"   # Xoá tất cả "order_id_1"
LREM order_history:user-001 1 "order_id_1"   # Xoá 1 phần tử từ đầu

# --- ADVANCED: Queue với Blocking ---
LPUSH l:ticket ticket:01
BLPOP l:ticket 0                    # Consumer chờ lấy ticket

# Trim list (giữ chỉ N phần tử gần nhất)
LTRIM order_history:user-001 0 99   # Giữ 100 phần tử đầu
```

---

## 6. SET

Tập hợp không có thứ tự, không trùng lặp. Phù hợp cho tag, danh sách yêu thích, friend list.

```bash
# --- ADD ---
SADD favorite_products:user-001 product1 product2 product3
SADD favorite_products:user-002 product1 product5
SADD favorite_products:user-003 product10 product5

# --- GET ---
# Lấy toàn bộ members
SMEMBERS favorite_products:user-001

# Lấy N phần tử ngẫu nhiên (không xoá)
SRANDMEMBER favorite_products:user-001 2

# Số lượng members
SCARD favorite_products:user-001

# --- SET OPERATIONS ---
# Giao (phần tử có trong TẤT CẢ sets)
SINTER favorite_products:user-001 favorite_products:user-002 favorite_products:user-003

# Hiệu (phần tử có trong set đầu nhưng không trong các set còn lại)
SDIFF favorite_products:user-001 favorite_products:user-002 favorite_products:user-003

# Hợp (tất cả phần tử, không trùng lặp)
SUNION favorite_products:user-001 favorite_products:user-002 favorite_products:user-003

# Lưu kết quả union vào key mới
SUNIONSTORE all_favorite_products \
    favorite_products:user-001 \
    favorite_products:user-002 \
    favorite_products:user-003

# --- SCAN (phân trang, không block) ---
SSCAN favorite_products:user-001 0 COUNT 10

# --- DEL ---
SREM favorite_products:user-001 product2    # Xoá member cụ thể

# Lấy ngẫu nhiên VÀ xoá
SPOP favorite_products:user-001

# Kiểm tra member có tồn tại không
SISMEMBER favorite_products:user-001 product1   # 1 = tồn tại
```

---

## 7. ZSET

Sorted Set: tập hợp không trùng lặp nhưng có score để sắp xếp. Phù hợp cho leaderboard, ranking.

```bash
# --- ADD (score member) ---
ZADD sorted_favorite_products:user-001 1 "product3"
ZADD sorted_favorite_products:user-001 2 "product2" 3 "product1" 4 "product6" 5 "product5" 6 "product4"

# --- GET ---
# Sort ASC (thấp → cao)
ZRANGE sorted_favorite_products:user-001 0 -1
ZRANGE sorted_favorite_products:user-001 0 -1 WITHSCORES

# Sort DESC (cao → thấp)
ZREVRANGE sorted_favorite_products:user-001 0 -1
ZREVRANGE sorted_favorite_products:user-001 0 -1 WITHSCORES

# Lấy score của 1 member
ZSCORE sorted_favorite_products:user-001 "product2"

# Lấy rank (vị trí) của member
ZRANK    sorted_favorite_products:user-001 "product2"   # ASC rank
ZREVRANK sorted_favorite_products:user-001 "product2"   # DESC rank

# Lấy theo khoảng score
ZRANGEBYSCORE sorted_favorite_products:user-001 2 4
ZRANGEBYSCORE sorted_favorite_products:user-001 2 4 WITHSCORES

# Đếm member trong khoảng score
ZCOUNT sorted_favorite_products:user-001 2 4

# Tổng số members
ZCARD sorted_favorite_products:user-001

# --- UPDATE ---
ZINCRBY sorted_favorite_products:user-001 10 "product2"  # Tăng score 10

# --- DEL ---
ZREM sorted_favorite_products:user-001 "product3"    # Xoá 1 member
DEL  sorted_favorite_products:user-001                # Xoá toàn bộ key

# Xoá các member có score trong khoảng
ZREMRANGEBYSCORE sorted_favorite_products:user-001 1 2
```

---

## 8. REDIS PUB/SUB

Publish/Subscribe — mô hình messaging thời gian thực.

```bash
# --- PUBLISH (gửi message) ---
PUBLISH user_tai_heo "hello"
PUBLISH user_tai_heo "{ \"event\": \"order_created\", \"orderId\": 123 }"

# --- SUBSCRIBE (nhận message) ---
# Lắng nghe 1 channel
SUBSCRIBE user_tai_heo

# Lắng nghe nhiều channels
SUBSCRIBE user_tai_heo user_hao_dep

# Pattern Subscribe (dùng wildcard)
PSUBSCRIBE user.*          # user.tai, user.hao, user.xxx
PSUBSCRIBE .*user          # prefix.user
PSUBSCRIBE user*           # userTai, userHao, ...

# --- Xem channels đang active ---
PUBSUB CHANNELS            # Danh sách tất cả channels đang có subscriber
PUBSUB CHANNELS user*      # Channels theo pattern
PUBSUB NUMSUB user_tai_heo # Số lượng subscriber của channel
```

---

## 9. REDIS BITMAPS AND BITFIELDS

Dùng để lưu bit flags — rất tiết kiệm bộ nhớ. Phù hợp cho check-in, trạng thái online...

```bash
# --- SETBIT / GETBIT ---
SETBIT user:status 1002 1               # Set bit của user_id=1002 là 1 (active)
SETBIT user:status 1002 0               # Set bit của user_id=1002 là 0 (inactive)
GETBIT user:status 1002                 # Lấy bit của user_id=1002

# Đếm số bits = 1 (số user đang active)
BITCOUNT user:status

# Đếm trong khoảng byte
BITCOUNT user:status 0 10

# --- BITFIELD (nâng cao) ---
BITFIELD user:age SET u8 0 25          # Set age của user tại offset 0 = 25 (unsigned 8-bit)
BITFIELD user:age GET u8 0             # Lấy age
BITFIELD user:age INCRBY u8 0 1        # Tăng tuổi lên 1

# --- Use Case: Daily Active User (DAU) ---
# user_id=101 đăng nhập ngày hôm nay
SETBIT login:2024-01-15 101 1

# Kiểm tra user 101 có đăng nhập hôm nay không
GETBIT login:2024-01-15 101

# Tổng số user đăng nhập ngày hôm nay
BITCOUNT login:2024-01-15
```

---

## 10. STREAM

Cấu trúc dữ liệu dạng log có thứ tự thời gian. Phù hợp cho event sourcing, message queue mạnh hơn Pub/Sub.

```bash
# --- PUBLISH (XADD) ---
# * = auto generate ID (timestamp-sequence)
XADD tickets * name "nguyen tien tai" seat "B12" movieId 53 sessionId 832
XADD tickets * name "nguyen quoc hao" seat "B13" movieId 53 sessionId 832
XADD tickets * name "dang thi ngoc tuyen" seat "B14" movieId 53 sessionId 832

# Với ID tùy chỉnh
XADD tickets 1711081499957-0 name "custom_id_user" seat "A1"

# --- INFO ---
XLEN tickets                            # Số lượng messages trong stream

# --- READ ---
# Đọc từ đầu stream
XREAD STREAMS tickets 0-0

# Đọc từ ID cụ thể
XREAD STREAMS tickets 1711081499957-0

# Blocking read — chờ message mới ($ = chỉ nhận message từ bây giờ)
XREAD BLOCK 60000 STREAMS tickets $

# Đọc theo khoảng ID
XRANGE tickets 1711081499957-0 1711081531247-0

# Đọc N messages gần nhất
XRANGE tickets - + COUNT 3

# Đọc ngược (mới nhất trước)
XREVRANGE tickets + - COUNT 5

# --- CONSUMER GROUP ---
# Tạo group ($ = chỉ nhận message mới từ bây giờ)
XGROUP CREATE tickets officer_group $

# Tạo group và nhận từ đầu stream
XGROUP CREATE tickets officer_group 0

# Consumer đọc message từ group
XREADGROUP GROUP officer_group consumer1 COUNT 10 STREAMS tickets >

# Blocking consumer (chờ message mới)
XREADGROUP GROUP officer_group consumer2 BLOCK 360000 STREAMS tickets >

# Acknowledge (xác nhận đã xử lý message)
XACK tickets officer_group <message-id>

# Xem messages chưa được ACK
XPENDING tickets officer_group - + 10

# --- TRIM (giới hạn độ dài stream) ---
XTRIM tickets MAXLEN 1000               # Giữ tối đa 1000 messages
XADD tickets MAXLEN 1000 * name "tai"  # Auto trim khi thêm
```

---

## 11. LOADTEST

Kiểm tra hiệu năng với [loadtest](https://www.npmjs.com/package/loadtest):

```bash
# Cài đặt
npm install -g loadtest

# Cú pháp
# -n: tổng số requests
# -c: số requests đồng thời (concurrency)
loadtest -n 100 -c 10 http://localhost:5001/api/v2/redis/lock

# Ví dụ thực tế
loadtest -n 1000 -c 50 http://localhost:5001/api/v1/products    # 1000 req, 50 đồng thời
loadtest -n 500  -c 20 -m POST http://localhost:5001/api/v1/login
```

---

## 12. CHECK CORE CLUSTER NODEJS

Xem thông tin CPU để tối ưu số lượng worker processes trong Node.js Cluster:

```bash
# Số luồng logic (logical CPUs)
lscpu

# Số processors
cat /proc/cpuinfo | grep "processor" | wc -l

# Số physical cores
cat /proc/cpuinfo | grep "core id" | sort | uniq | wc -l
```

> 💡 **Tip**: Số worker trong Node.js Cluster thường bằng số logical CPUs:
> ```js
> const numCPUs = require('os').cpus().length;
> ```

---

<div align="center">

## 📞 Tác Giả

**Code Web Không Khó — Thầy Tài**

[![Facebook](https://img.shields.io/badge/Facebook-codewebkhongkho-1877F2?logo=facebook)](https://www.facebook.com/codewebkhongkho)
[![GitHub](https://img.shields.io/badge/GitHub-fdhhhdjd-181717?logo=github)](https://github.com/fdhhhdjd)
[![Email](https://img.shields.io/badge/Email-nguyentientai10@gmail.com-D14836?logo=gmail)](mailto:nguyentientai10@gmail.com)

*Chúc bạn học Redis hiệu quả! Have a nice day ❤️*

</div>
