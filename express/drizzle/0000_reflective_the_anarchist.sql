CREATE TABLE `device_statuses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `device_statuses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `devices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`code` varchar(50) NOT NULL,
	`cost` int NOT NULL,
	`description` varchar(255),
	`status_id` int NOT NULL,
	CONSTRAINT `devices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loans` (
	`user_id` int NOT NULL,
	`device_id` int NOT NULL,
	`date_received` date NOT NULL,
	`date_returned` date,
	`description` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `project_members` (
	`user_id` int NOT NULL,
	`project_id` int NOT NULL,
	`is_manager` boolean NOT NULL,
	CONSTRAINT `project_members_user_id_project_id_pk` PRIMARY KEY(`user_id`,`project_id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`description` varchar(255),
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`role_id` int NOT NULL,
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100) NOT NULL,
	`email` varchar(50) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`password` varchar(255) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
ALTER TABLE `devices` ADD CONSTRAINT `devices_status_id_device_statuses_id_fk` FOREIGN KEY (`status_id`) REFERENCES `device_statuses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loans` ADD CONSTRAINT `loans_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loans` ADD CONSTRAINT `loans_device_id_devices_id_fk` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_members` ADD CONSTRAINT `project_members_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_members` ADD CONSTRAINT `project_members_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE no action ON UPDATE no action;