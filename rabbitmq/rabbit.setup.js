import amqp from "amqplib";

class RabbitMQClient {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queues = new Map();
    this.exchanges = new Map();
  }

  async connect(url = process.env.RABBITMQ_URL) {
    try {
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      // Handle connection events
      this.connection.on("error", (err) => {
        console.error("RabbitMQ connection error:", err);
        this._reconnect(url);
      });

      this.connection.on("close", () => {
        console.warn("RabbitMQ connection closed, attempting to reconnect...");
        this._reconnect(url);
      });

      console.log(`Successfully connected to RabbitMQ from ${url}`);
      return this.channel;
    } catch (error) {
      console.error("Failed to connect to RabbitMQ:", error);
      throw error;
    }
  }

  async _reconnect(url) {
    try {
      setTimeout(async () => {
        console.log("Attempting to reconnect to RabbitMQ...");
        await this.connect(url);
      }, 5000);
    } catch (error) {
      console.error("Failed to reconnect to RabbitMQ:", error);
    }
  }

  async createQueue(name, options = { durable: true }) {
    //Available Options are : durable, exclusive, autoDelete, arguments
    /**
     * durable: If set to true, the queue will survive broker restarts, modulo the effects of queue TTLs or the `autoDelete` flag.
     * exclusive: If set to true, scopes the queue to the connection (see Connection#createChannel).
     * autoDelete: If set to true, the queue will be deleted when the number of consumers drops to zero (see Channel#consume).
     * arguments: Additional arguments, usually parameters for some kind of broker-specific extension e.g., high availability, TTL etc.
     */


    try {
      const queue = await this.channel.assertQueue(name, options);
      this.queues.set(name, queue);
      return queue;
    } catch (error) {
      console.error(`Error creating queue ${name}:`, error);
      throw error;
    }
  }

  async createExchange(name, type = "topic", options = { durable: true }) {
    //Exchange Types: direct, fanout, topic, headers
    //Exchange does not store any message, it just routes the message to the queue based on the routing key
    // Routing Key is a string that the exchange looks at when deciding how to route the message to queues
    try {
      await this.channel.assertExchange(name, type, options);
      this.exchanges.set(name, { name, type });
      return { name, type };
    } catch (error) {
      console.error(`Error creating exchange ${name}:`, error);
      throw error;
    }
  }

  async bindQueueToExchange(queueName, exchangeName, routingKey) {
    //Binding a queue to an exchange is the relationship between the exchange and the queue
    //The queue is interested in messages from the exchange


    try {
      await this.channel.bindQueue(queueName, exchangeName, routingKey);
      console.log(
        `Queue ${queueName} bound to exchange ${exchangeName} with routing key ${routingKey}`
      );
    } catch (error) {
      console.error(
        `Error binding queue ${queueName} to exchange ${exchangeName}:`,
        error
      );
      throw error;
    }
  }


  async publishToExchange(exchangeName, routingKey, message) {
    //Publish to Exchange is the process of sending a message to the exchange
    //The exchange then routes the message to the queue based on the routing key
    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      return this.channel.publish(exchangeName, routingKey, messageBuffer, {
        persistent: true,
        contentType: "application/json",
      });
    } catch (error) {
      console.error(`Error publishing to exchange ${exchangeName}:`, error);
      throw error;
    }
  }

  async sendToQueue(queueName, message) {
    //Sending to Queue is the process of sending a message to the queue
    //The message will be stored in the queue until it is consumed by a consumer
    // sendToQueue and publishToExchange differ in the way the message is routed. For example, in the case of a fanout exchange, the message will be sent to all queues bound to the exchange when using publishToExchange, but only to the specified queue when using sendToQueue method.
    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      return this.channel.sendToQueue(queueName, messageBuffer, {
        persistent: true,
        contentType: "application/json",
      });
    } catch (error) {
      console.error(`Error sending to queue ${queueName}:`, error);
      throw error;
    }
  }

  async consumeFromQueue(queueName, callback) {
    try {
      return this.channel.consume(queueName, async (message) => {
        if (message) {
          try {
            const content = JSON.parse(message.content.toString());
            await callback(content, message);
            this.channel.ack(message);
          } catch (error) {
            console.error(
              `Error processing message from queue ${queueName}:`,
              error
            );
            this.channel.nack(message);
          }
        }
      });
    } catch (error) {
      console.error(`Error consuming from queue ${queueName}:`, error);
      throw error;
    }
  }

  async closeConnection() {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      console.log("RabbitMQ connection closed successfully");
    } catch (error) {
      console.error("Error closing RabbitMQ connection:", error);
      throw error;
    }
  }
}

export default RabbitMQClient;
