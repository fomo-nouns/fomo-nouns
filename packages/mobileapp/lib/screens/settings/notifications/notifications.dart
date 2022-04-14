import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_platform_widgets/flutter_platform_widgets.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobileapp/app/colors.dart';
import 'package:mobileapp/app/const_names.dart';
import 'package:mobileapp/screens/settings/notifications/bloc/notifications_bloc.dart';
import 'package:mobileapp/screens/settings/notifications/how_notifications_work_screen.dart';
import 'package:mobileapp/screens/settings/widgets/selector.dart';
import 'package:mobileapp/screens/shared_widgets/buttons.dart';
import 'package:mobileapp/screens/shared_widgets/helper.dart';
import 'package:notifications_repository/notifications_repository.dart';

class NotificationsSection extends StatelessWidget {
  const NotificationsSection({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SidePadding(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          _title,
          const _Selectors(),
          SizedBox(height: 20.h),
          FlatTextButton(
              text: "How notifications work",
              onTap: () {
                Navigator.push(
                  context,
                  platformPageRoute(
                    context: context,
                    builder: (_) => const HowNotificationsWorkScreen(),
                  ),
                );
              }),
        ],
      ),
    );
  }

  Widget get _title => Padding(
        padding: EdgeInsets.only(bottom: 20.w),
        child: Text(
          "Notifications",
          style: TextStyle(
            fontFamily: AppFonts.londrina,
            fontSize: 36.sp,
            color: AppColors.textColor,
          ),
        ),
      );
}

class _Selectors extends StatelessWidget {
  const _Selectors({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        BlocBuilder<NotificationsBloc, NotificationsState>(
          buildWhen: (previousState, state) {
            if (state.status.isError) {
              return true;
            } else if (previousState.onAuctionEnd == state.onAuctionEnd) {
              return false;
            } else if (state.status.isUpdating || state.status.isSuccess) {
              return false;
            } else {
              return true;
            }
          },
          builder: (context, state) {
            return Selector(
              key: UniqueKey(),
              type: NotificationTopics.onAuctionEnd.name,
              text: "On auction end",
              value: state.onAuctionEnd,
              onChange: (newValue) {
                context
                    .read<NotificationsBloc>()
                    .add(NotificationsTopicStateChanged(
                      topic: NotificationTopics.onAuctionEnd,
                      value: newValue,
                    ));
              },
            );
          },
        ),
        SizedBox(height: 10.h),
        BlocBuilder<NotificationsBloc, NotificationsState>(
          buildWhen: (previousState, state) {
            if (state.status.isError) {
              return true;
            } else if (previousState.fiveMinutesBeforeEnd ==
                state.fiveMinutesBeforeEnd) {
              return false;
            } else if (state.status.isUpdating || state.status.isSuccess) {
              return false;
            } else {
              return true;
            }
          },
          builder: (context, state) {
            return Selector(
              key: UniqueKey(),
              type: NotificationTopics.fiveMinutesBeforeEnd.name,
              text: "5 min before end",
              value: state.fiveMinutesBeforeEnd,
              onChange: (newValue) {
                context
                    .read<NotificationsBloc>()
                    .add(NotificationsTopicStateChanged(
                      topic: NotificationTopics.fiveMinutesBeforeEnd,
                      value: newValue,
                    ));
              },
            );
          },
        ),
        SizedBox(height: 10.h),
        BlocBuilder<NotificationsBloc, NotificationsState>(
          buildWhen: (previousState, state) {
            if (state.status.isError) {
              return true;
            } else if (previousState.tenMinutesBeforeEnd ==
                state.tenMinutesBeforeEnd) {
              return false;
            } else if (state.status.isUpdating || state.status.isSuccess) {
              return false;
            } else {
              return true;
            }
          },
          builder: (context, state) {
            return Selector(
              key: UniqueKey(),
              type: NotificationTopics.tenMinutesBeforeEnd.name,
              text: "10 min before end",
              value: state.tenMinutesBeforeEnd,
              onChange: (newValue) {
                context
                    .read<NotificationsBloc>()
                    .add(NotificationsTopicStateChanged(
                      topic: NotificationTopics.tenMinutesBeforeEnd,
                      value: newValue,
                    ));
              },
            );
          },
        ),
      ],
    );
  }
}
